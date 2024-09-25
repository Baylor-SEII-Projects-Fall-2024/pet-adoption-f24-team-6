import React from 'react';
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

// Initialize Redux
let initialState = {};
let reduxStore = buildStore(initialState);

export default function App({ Component, pageProps }) {

  const [value, setValue] = React.useState('');

  const router = useRouter();

  return (
    <ReduxProvider store={reduxStore}>
      <AppCacheProvider>
        <Head>
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <PetAdoptionThemeProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
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

          </Box>
          <Component {...pageProps} />
        </PetAdoptionThemeProvider>
      </AppCacheProvider>
    </ReduxProvider>
  );
}
