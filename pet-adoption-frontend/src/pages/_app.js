import React, { useEffect } from 'react';
import Head from 'next/head';
import { Provider as ReduxProvider } from 'react-redux';
import { useRouter } from 'next/router';

import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import {
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    CssBaseline,
    Menu,
    MenuItem
} from '@mui/material';

import { PetAdoptionThemeProvider } from '@/utils/theme';
import { buildStore } from '@/utils/redux';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from '@mui/icons-material/Help';
import styles from '../styles/Loading.module.css'; // CSS module for styling

import '@/styles/globals.css'
import Cookies from "js-cookie";

// Initialize Redux
let initialState = {};
let reduxStore = buildStore(initialState);

export default function App({ Component, pageProps }) {

  const [value, setValue] = React.useState('');
  const [initials, setInitials] = React.useState('');
  const [userType, setUserType] = React.useState('');
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const [loadingInitials, setLoadingInitials] = React.useState(true);

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

                if (!response.ok) {
                    console.error('Authentication failed', response.statusText);
                }
                setUserType(data?.userType)
                setLoadingAuth(false);
            } catch (error) {
                console.error("Error during checkAuth", error);
            }
        };

        if (token) {
            checkAuth();
            getInitials()
        }
    }, [token]);

    const getInitials = async () => {
        if(token){
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8080/api/auth/getNames?authToken=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                data = await response.json()

                if (!response.ok) {
                    console.error('Error', response.statusText);
                } else {
                    setInitials(data?.initials);
                    setLoadingInitials(false)
                }
            } catch (error) {
                console.error("Error during getNames", error);
            }
        }
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleAvatarHover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    if(token !== undefined && (loadingAuth || loadingInitials)) {
        return (
            <div className={styles.loadingContainer}>
                <img
                    src="/dog-loading.png" // Replace with your image path
                    alt="Loading..."
                    className={styles.loadingImage}
                />
            </div>
        )
    }

    return (
        <ReduxProvider store={reduxStore}>
            <AppCacheProvider>
                <Head>
                    <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width'/>
                    <link rel='icon' href='/favicon.ico'/>
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
                  <>
                      <Avatar
                          sx={{ marginRight: '1.5rem', marginTop: '1.75rem' }}
                          onMouseEnter={handleAvatarHover}
                          onClick={() => router.push('/account')}
                      >
                          {initials}
                      </Avatar>

                      <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          PaperProps={{
                              onMouseLeave: handleMenuClose
                          }}
                      >
                          <MenuItem onClick={() => {
                              router.push('/account-details');
                              handleMenuClose();
                          }}>Account Details</MenuItem>

                          {userType === 'ADMIN' &&(
                              <MenuItem onClick={() => {
                                  router.push('/all-users');
                                  setValue('');
                              }}>All Users</MenuItem>
                          )
                          }

                          {userType === 'ADOPTION_CENTER' && (
                              <>
                                  <MenuItem onClick={() => {
                                      router.push('/registerPet');
                                      setValue('');
                                  }}>Register Pet</MenuItem>

                                  <MenuItem onClick={() => {
                                    router.push('/my-pets');
                                    setValue('');
                                    }}>My Pets</MenuItem>
                              </>
                          )}

                          {userType === 'CUSTOMER' &&(
                              <MenuItem onClick={() => {
                                  router.push('/preferences');
                                  handleMenuClose();
                              }}>Preferences</MenuItem>
                          )}

                          <MenuItem onClick={() => {
                              Cookies.remove('authToken');
                              router.push('/');
                              setValue('');
                          }}>Sign Out</MenuItem>

                      </Menu>
                  </>
              )}

          </Box>
          <Component {...pageProps} />
        </PetAdoptionThemeProvider>
      </AppCacheProvider>
    </ReduxProvider>
  );
}
