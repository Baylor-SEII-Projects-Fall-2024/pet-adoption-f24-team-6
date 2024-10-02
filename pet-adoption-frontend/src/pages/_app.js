import React, { useEffect } from 'react';
import Head from 'next/head';
import { Provider as ReduxProvider } from 'react-redux';
import { useRouter } from 'next/router';

import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import {BottomNavigation, BottomNavigationAction, Box, Button, CssBaseline} from '@mui/material';

import { PetAdoptionThemeProvider } from '@/utils/theme';
import { buildStore } from '@/utils/redux';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';

import '@/styles/globals.css'
import Cookies from "js-cookie";

// Initialize Redux
let initialState = {};
let reduxStore = buildStore(initialState);

export default function App({ Component, pageProps }) {

  const [value, setValue] = React.useState('');

  const token = Cookies.get('authToken');

  const router = useRouter();

  let data = null;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/checkAuth?authToken=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                data = await response.json()
                console.log(data)

                if (!response.ok) {
                    console.error('Authentication failed', response.statusText);
                }
            } catch (error) {
                console.error("Error during checkAuth", error);
            }
        };

        if (token) {
            checkAuth();
        }
    }, [token]);


  return (
    <ReduxProvider store={reduxStore}>
      <AppCacheProvider>
        <Head>
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <PetAdoptionThemeProvider>
          <CssBaseline />

          <Box sx={{
            display: 'flex',
            displayDirection: 'row'
          }}>

              <Box sx={{
                  marginLeft: '2rem',
                  marginTop: '2rem',
                  marginRight: '1rem'
              }}>
                  <img src="/home-furever-logo.png" alt="Logo" style={{ width: '200px', height: '65px' }} onClick={() => {
                      router.push('/');
                      setValue('');
                  }}/>
              </Box>

            <Box sx={{ width: '100vw',
              display: 'flex',
              justifyContent: 'center',
              marginLeft: '150px',
              marginTop: '2rem'
            }}>
              <BottomNavigation
                  showLabels
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);

                      switch (newValue) {
                          case 0:
                              router.push('/browse'); // Route to /browse
                              break;
                          case 1:
                              router.push('/events'); // Route to /events
                              break;
                          case 2:
                              router.push('/contact-us'); // Route to /contact
                              break;
                          case 3:
                              router.push('/FAQ'); // Route to /faq
                              break;
                          default:
                              break;
                      }
                  }}
                  sx={{width: '60vw'}}
              >
                <BottomNavigationAction label="Browse" icon={<SearchIcon />}  />
                <BottomNavigationAction label="Events" icon={<HomeIcon />} />
                <BottomNavigationAction label="Contact Us" icon={<PersonIcon />} />
                <BottomNavigationAction label="FAQ" icon={<HelpIcon />} />
              </BottomNavigation>
            </Box>



              {(!token || data?.Authorized) && (
                  <>
                  <Button
                      variant="outlined"
                      size='small'
                      disableElevation
                      sx={{
                          height: '35px',
                          width: '80px',
                          marginRight: '1.5rem',
                          marginTop: '2rem'
                      }}
                      onClick={() => {
                          router.push('/sign-in');
                          setValue('');
                      }}
                  >
                      Sign In
                  </Button>

                  <Button
                  variant="outlined"
                  size='small'
                  disableElevation
                  sx={{
                  height: '35px',
                  width: '80px',
                  marginRight: '1.5rem',
                  marginTop: '2rem'
              }}
              onClick={() => {
                  router.push('/register');
                  setValue('');
              }}
          >
              Register
          </Button>
                  </>)
              }

              {(token && !data?.Authorized) && (
                  <Button
                      variant="outlined"
                      size='small'
                      disableElevation
                      sx={{
                          height: '35px',
                          width: '100px',
                          marginRight: '1.5rem',
                          marginTop: '2rem'
                      }}
                      onClick={() => {
                          Cookies.remove('authToken');
                          router.push('/');
                          setValue('');
                      }}
                  >
                      Sign Out
                  </Button>
              )}

          </Box>
          <Component {...pageProps} />
        </PetAdoptionThemeProvider>
      </AppCacheProvider>
    </ReduxProvider>
  );
}
