'use client';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import styles from './glotsphere.module.css';
import { useSession } from 'next-auth/react';
import FarcasterLoginBtn from '@/components/atoms/farcaster/FarcasterLoginBtn';
import { helloTranslated } from '@/components/landing-page/Glotsphere';
import ImageCarousel from '@/components/glotsphere/ImageCarousel';
// Import flag icon styles in your component or in globals.css
import { images } from '@/lib/data/glotsphere/utils';
import UserAvatar from '@/components/atoms/navbar/UserAvatar';
import { FaArrowDownLong } from 'react-icons/fa6';

interface FarcasterUser {
  signer_uuid: string;
  public_key: string;
  status: string;
  signer_approval_url?: string;
  fid?: number;
}

const supportedLanguages: string[] = [
  'Hindi',
  'English',
  'German',
  'Japanese',
  'French',
  'Mandarin',
  'Spanish',
  'Portuguese',
  'Korean',
  'Vietnamese',
];

export default function GlotspherePage() {
  const { data: session, status } = useSession();
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(
    null
  );
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [text, setText] = useState<string>('Hola!');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [noUserExists, setNoUserExists] = useState<boolean>(false);

  const LOCAL_STORAGE_KEYS = {
    FARCASTER_USER: 'farcasterUser',
  };

  /** Handlers
   * 1. handleSelectedLanguages - track lanhguages selected by the user
   * 2. handleCreateCast - create a cast with the selected languages and text
   * 3. handleCreateSigner - create a signer for the user
   */
  const handleSelectLanguages = (language: string) => {
    setSelectedLanguages((prev) => {
      // Check if the language is already selected
      if (prev.includes(language)) {
        // If selected, filter it out
        return prev.filter((lang) => lang !== language);
      } else {
        // If not selected, add it to the array
        return [...prev, language];
      }
    });
  };

  const handleCreateCast = async () => {
    setIsCasting(true);
    const castText = text.length === 0 ? 'gm' : text;
    // Encode the array of selected languages into a query string
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/glotsphere/cast`,
        {
          text: castText,
          languages: selectedLanguages,
          signer_uuid: farcasterUser?.signer_uuid,
        }
      );
      if (response.status === 200) {
        setText(''); // Clear the text field
        alert('Cast successful');
      }
    } catch (error) {
      console.error('Could not send the cast', error);
    } finally {
      setIsCasting(false); // Re-enable the button
    }
  };

  const createSigner = async () => {
    try {
      const response = await axios.get('/api/glotsphere/user/signer/create');
      console.log('Response from createSigner', response.data);

      // success = save signer (unapproved) to local storage
      // and update state to reflect unapproved signer on ui
      if (response.status === 201) {
        const { signer } = await response.data;
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.FARCASTER_USER,
          JSON.stringify(signer)
        );
        console.log('response.data', response.data);
        console.log('signer 106::', signer);
        setFarcasterUser(signer);
        setNoUserExists(false);
      }
    } catch (error) {
      console.error('API Call failed', error);
    }
  };

  /** Hooks
   * 1. Effect to check if the user has a signer
   * If the user has a signer, set the signer in the state | update UI
   * Proceed based on whether the signer is approved or not
   */
  useEffect(() => {
    // Check if user is authenticated
    const fetchUserFromBackend = async () => {
      try {
        console.log('Fetching user from backend for fid:', session?.user?.fid);
        const response = await fetch(`/api/glotsphere/user/signer/get`);

        console.log('Response from fetchUserFromBackend', response);
        const { signer } = await response.json();

        if (response.ok && signer) {
          const user: FarcasterUser = signer;
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.FARCASTER_USER,
            JSON.stringify(user)
          );
          setFarcasterUser(user);
        } else {
          console.error('No user signer_uuid exists');
          setNoUserExists(true);
        }
      } catch (error) {
        console.error('Error fetching user from API:', error);
      }
    };

    if (status === 'authenticated') {
      // Check local storage for FarcasterUser
      const storedData = localStorage.getItem(
        LOCAL_STORAGE_KEYS.FARCASTER_USER
      );
      console.log('147 : UseEffect - storedData Local:', storedData);

      // if storedData exists, set the user in the state
      // else if storedData does not exist, call backend to check if user has a signer and set the user in the state if backend returns the signer
      if (storedData) {
        const user: FarcasterUser = JSON.parse(storedData);
        console.log('stored data found:: 156,', user);
        setFarcasterUser(user);
      } else {
        fetchUserFromBackend();
      }
    }
  }, [status]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      farcasterUser &&
      farcasterUser.status === 'pending_approval'
    ) {
      let intervalId: NodeJS.Timeout;
      const startPolling = () => {
        intervalId = setInterval(async () => {
          try {
            const response = await axios.get(
              `/api/glotsphere/user/signer/get/?signer_uuid=${farcasterUser?.signer_uuid}`
            );
            const { signer } = response.data;
            console.log('179 in polling user:', signer);
            if (signer?.status === 'approved') {
              // store the user in local storage
              localStorage.setItem(
                LOCAL_STORAGE_KEYS.FARCASTER_USER,
                JSON.stringify(signer)
              );

              setFarcasterUser(signer);
              // Todo: Update supabase db status
              await axios.get(
                `/api/glotsphere/user/signer/update/?signer_uuid=${farcasterUser?.signer_uuid}`
              );
              clearInterval(intervalId);
            }
          } catch (error) {
            console.error('Error during polling', error);
          }
        }, 2000);
      };
      const stopPolling = () => {
        clearInterval(intervalId);
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          stopPolling();
        } else {
          startPolling();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      // Start the polling when the effect runs.
      startPolling();

      // Cleanup function to remove the event listener and clear interval.
      return () => {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
        clearInterval(intervalId);
      };
    }
  }, [farcasterUser]);

  useEffect(() => {
    console.log('FC User', farcasterUser);
  }, [farcasterUser]);

  console.log('Session in glotsphere route', session);

  return (
    <div className="bg-gshero bg-cover min-w-full min-h-screen">
      <div className="min-w-full min-h-screen bg-black bg-opacity-70 flex flex-col items-center justify-center">
        {/** Unauth 1: Sign In With Farcaster */}
        {status === 'unauthenticated' && (
          <div className="w-11/12 xs:w-[400px] sm:w-[400px] md:w-[400px] lg:w-[400px] rounded-lg min-h-4/5screen border-2 border-gsElectricBlue text-white flex flex-col items-center justify-around bg-black bg-opacity-40">
            <div className="text-7xl font-black font-urbanist flex flex-1 flex-col justify-end  items-center">
              <div>glotsphere</div>
              <div className="text-3xl font-urbanist mt-12">
                cast in any language
              </div>
            </div>

            {/* Carousel for images */}
            <div className="flex-1 flex items-center">
              <ImageCarousel images={images} />
            </div>

            <div className="w-11/12  flex-1">
              <FarcasterLoginBtn
                buttonBgColor="#3671FF"
                buttonBgColorHover="#0070f3"
              />
            </div>
          </div>
        )}

        {/** Auth 0: UserAvatar Button once Authenticated */}
        {status === 'authenticated' && (
          <div className="top-2 right-10 absolute text-white">
            <UserAvatar
              bgColor="gsElectricBlue"
              bgColorHover="gsElectricBlueHover"
            />
          </div>
        )}

        {/** Auth 1: auth + check for user (local + backend) => No => Create Signer */}

        {status === 'authenticated' && noUserExists && (
          <div className="w-11/12 xs:w-[400px] sm:w-[400px] md:w-[400px] lg:w-[400px] rounded-lg min-h-4/5screen border-2 bg-black bg-opacity-40 border-gsElectricBlue text-white flex flex-col items-center justify-around">
            <div className="text-7xl font-black font-urbanist flex flex-1 flex-col justify-end items-center">
              <div>welcome!</div>
              <div className="text-2xl font-urbanist mt-12">
                just a few more steps...
              </div>
            </div>
            <div className="text-lg flex flex-col flex-1 items-center justify-end gap-4">
              <div className="text-lg font-urbanist">create signer</div>
              <FaArrowDownLong />
              <div>scan & approve</div>
              <FaArrowDownLong />
              <div>start casting</div>
            </div>

            <div className="w-11/12  flex-1 flex flex-col items-center justify-center">
              <button
                className="relative w-full sm:text-xl md:text-xl lg:text-xl text-white font-urbanist font-extrabold mt-8 sm:mt-8 md:mt-8 lg:mt-8"
                onClick={createSigner}
              >
                <div className="absolute inset-x-0 h-full -bottom-1 bg-electric-blue rounded-2xl"></div>

                <div className="relative bg-gsElectricBlue border border-gsElectricBlue rounded-2xl py-2 px-10 sm:py-3 sm:px-20 md:py-3 md:px-20 lg:py-3 lg:px-20 transition transform duration-200 active:translate-y-1">
                  create signer
                </div>
              </button>
            </div>
          </div>
        )}

        {/** Auth 2: auth + pending_approval + no url => fetch url? */}
        {/* {status === 'authenticated' &&
          farcasterUser?.status === 'pending_approval' &&
          !farcasterUser?.signer_approval_url && (
            <div className="bg-white">get url?</div>
          )} */}

        {/** Auth 3: auth + pending_pending_approval + url => show qr*/}
        {status === 'authenticated' &&
          farcasterUser?.status === 'pending_approval' &&
          farcasterUser?.signer_approval_url && (
            <div className="w-11/12 xs:w-[400px] sm:w-[400px] md:w-[400px] lg:w-[400px] rounded-lg min-h-4/5screen border-2 bg-black bg-opacity-40 border-gsElectricBlue text-white flex flex-col items-center justify-around">
              <div className="text-7xl font-black font-urbanist flex flex-1 flex-col justify-center items-center mt-12">
                <div>welcome!</div>
                <div className="text-2xl font-urbanist mt-12">
                  almost there...
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center">
                <QRCode
                  bgColor="#ffffff"
                  fgColor="#000"
                  size={200}
                  value={farcasterUser.signer_approval_url}
                />
                <div className="my-6">OR</div>
                <a
                  href={farcasterUser.signer_approval_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gsElectricBlue"
                >
                  (Click here to view the signer URL on mobile)
                </a>
                <div className="text-2xl font-urbanist mt-12">
                  just scan and approve
                </div>
              </div>
            </div>
          )}

        {/** Auth 4: auth + approved => show cast box */}
        {status === 'authenticated' && farcasterUser?.status === 'approved' && (
          <div className="w-11/12 xs:w-[400px] sm:w-[400px] md:w-[400px] lg:w-[400px] rounded-lg min-h-4/5screen border-2 bg-black bg-opacity-40 border-gsElectricBlue text-white flex flex-col items-center justify-around">
            <div className="text-lg font-black font-urbanist flex flex-1 w-full flex-col justify-center items-center">
              <div className="w-full relative flex flex-col flex-1">
                <textarea
                  className={
                    'border border-gsElectricBlue rounded-lg w-full px-2 bg-black relative flex-1'
                  }
                  placeholder="What's on your mind?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                />
                <div className="absolute bottom-1 right-1 text-sm">
                  {text.length}/300
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center flex-1 text-white">
                <h3 className="pb-4">Select Languages</h3>
                <div className="grid grid-cols-2 gap-4">
                  {supportedLanguages.map((language, index) => (
                    <div key={index} className="">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(language)}
                          onChange={() => handleSelectLanguages(language)}
                        />
                        <span className="pl-2">{language}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="text-sm pt-5">
                  *If no language is selected, it simply casts the text!
                </div>
              </div>

              <div className="w-11/12  flex-1 flex flex-col items-center justify-center">
                <button
                  className="relative w-full sm:text-xl md:text-xl lg:text-xl text-white font-urbanist font-extrabold"
                  onClick={handleCreateCast}
                >
                  <div className="absolute inset-x-0 h-full -bottom-1 bg-electric-blue rounded-2xl"></div>

                  <div className="relative bg-gsElectricBlue border border-gsElectricBlue rounded-2xl py-2 px-10 sm:py-3 sm:px-20 md:py-3 md:px-20 lg:py-3 lg:px-20 transition transform duration-200 active:translate-y-1">
                    cast
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

{
  /** Unauth 1: unauth => SIWF */
}
{
  /** Auth 1: done: auth + check for user (local + backend) => No => Create Signer */
}
// pending_approval comes from user - user = Yes implicit if pending_approval available
{
  /** Auth 2: done: auth + pending_approval + no url => fetch url? */
}
{
  /** Auth 3: done: auth + pending_pending_approval + url => show qr*/
}
{
  /** Auth 4: done: auth + approved => show cast box */
}
