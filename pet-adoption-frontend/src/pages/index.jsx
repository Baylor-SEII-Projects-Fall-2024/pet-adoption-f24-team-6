import React from 'react';
import Head from 'next/head'
import ImageCarousel from '../components/imageCarousel'
import {Box, Button, Card, CardContent, Stack, Typography} from '@mui/material'
import styles from '@/styles/Home.module.css'
import Footer from "@/components/Footer";

export default function HomePage() {

  return (
      <>
          <Head>
              <title>Home Page | Baylor Furries</title>
          </Head>

          <Box sx={{height: "20px"}}></Box>
          <ImageCarousel/>
          <h1 style={{marginLeft: '1100px', marginTop: '250px'}}>HOMEPAGE</h1>
          <Footer />

      </>
  );
}
