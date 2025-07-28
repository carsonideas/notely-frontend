

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  GlobalStyles,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// Global styles to reset all margins and padding
const globalStyles = (
  <GlobalStyles
    styles={{
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      'html, body': {
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
      },
      '#root': {
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
      },
    }}
  />
);

// Declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': {
        src: string;
        style?: React.CSSProperties;
        speed?: string;
        autoplay?: boolean;
        loop?: boolean;
      };
    }
  }
}

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSignup = () => {
    console.log('Signup clicked');
  };

  // Load the Lottie script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
    script.type = 'module';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const noteCards = [
    {
      title: 'Team Workshop',
      badge: 'Important',
      content: 'Quick notes from today\'s meeting. Important decisions and action items captured for easy reference and follow-up...',
      borderColor: 'rgba(255, 106, 0, 0.6)',
    },
    {
      title: 'Daily Journal',
      badge: 'Personal',
      content: 'Personal reflections and thoughts from today. Automatically organized by mood and topics for easy searching...',
      borderColor: 'rgba(175, 82, 222, 0.6)',
    },
    {
      title: 'Study Notes',
      badge: 'Academic',
      content: 'Random thoughts and ideas captured throughout the day. Quick notes help preserve creative moments and insights...',
      borderColor: 'rgba(255, 106, 0, 0.4)',
    },
  ];

  return (
    <>
      {globalStyles}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        marginTop: 8,
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d1b69 100%)',
        color: 'white',
        overflow: 'auto',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 106, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(175, 82, 222, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 106, 0, 0.08) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 1,
        },
      }}>
        <Box sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box',
        }}>
          <Grid 
            container 
            spacing={0} 
            alignItems="center" 
            sx={{ 
              width: '100%', 
              minHeight: '100vh',
              margin: 0,
              padding: 0,
              maxWidth: 'none',
            }}
          >
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{ 
                padding: isMobile ? '10px' : '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Notes-taking animation */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px',
                mt: 4,
                opacity: 0.9,
                '& dotlottie-wc': {
                  width: '180px',
                  height: '180px',
                  filter: 'drop-shadow(0 4px 20px rgba(255, 106, 0, 0.3))',
                  [theme.breakpoints.down('md')]: {
                    width: '140px',
                    height: '140px',
                  },
                  [theme.breakpoints.down('xs')]: {
                    width: '120px',
                    height: '120px',
                    // mt: 30px,
                  },
                },
              }}>
                <dotlottie-wc 
                  src="https://lottie.host/e93e9514-4c0a-411e-8dab-5738f71c0c58/fnRaBQ7M1Z.lottie"
                  speed="1"
                  autoplay
                  loop
                />
              </Box>
              
              {/* Hero Text Box */}
              <Box sx={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 10,
                mb: 25,
                padding: '40px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                [theme.breakpoints.down('md')]: {
                  padding: '30px 20px',
                },
              }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: isMobile ? '2.5rem' : '3.2rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginBottom: '20px',
                    color: 'white',
                    '& .gradient-text': {
                      background: 'linear-gradient(135deg, #ff6a00 0%, #af52de 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }
                  }}
                >
                  Capture <span className="gradient-text">brilliance</span>, organize <span className="gradient-text">effortlessly</span>
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    marginBottom: '32px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 400,
                  }}
                >
                  Elevate your productivity with AI-driven note management. From quick captures to intelligent summaries, make every thought count with seamless organization.
                </Typography>

                <Box sx={{ marginBottom: '40px' }}>
                  {['Smart Organization', 'Markdown Support', 'Quick Access', 'Trash Recovery'].map((feature) => (
                    <Chip 
                      key={feature}
                      icon={<CheckIcon sx={{
                        color: 'white !important',
                        background: 'rgba(255, 106, 0, 0.8)',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        backdropFilter: 'blur(5px)',
                      }} />} 
                      label={feature} 
                      sx={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 106, 0, 0.3)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        margin: '4px',
                        '&:hover': {
                          background: 'rgba(255, 106, 0, 0.2)',
                          borderColor: 'rgba(255, 106, 0, 0.5)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    />
                  ))}
                </Box>

                <Button
                  size="large"
                  onClick={handleSignup}
                  sx={{
                    background: 'rgba(255, 106, 0, 0.8)',
                    color: 'white',
                    border: '1px solid rgba(255, 106, 0, 0.5)',
                    boxShadow: '0 8px 20px rgba(255, 106, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 25,
                    padding: '16px 32px',
                    fontWeight: 600,
                    fontSize: 18,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 106, 0, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 30px rgba(255, 106, 0, 0.4)',
                    },
                  }}
                >
                  Get Started Today
                </Button>
              </Box>
            </Grid>

            <Grid 
              item 
              xs={12} 
              md={6}
              sx={{ 
                padding: isMobile ? '10px' : '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: -8,
              }}
            >
              <Box sx={{
                // pt: -3000,
                mt: -1,
                // mt: -1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: '20px',
                [theme.breakpoints.up('md')]: {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-around',
                },
              }}>
                {noteCards.map((card, index) => (
                  <Card
                    key={index}
                    sx={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderLeft: `3px solid ${card.borderColor}`,
                      borderRadius: 5,
                      backdropFilter: 'blur(20px)',
                      color: 'white',
                      transition: 'all 0.4s ease',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                      overflow: 'auto',
                      width: '100%',
                      maxWidth: '280px',
                      margin: '10px',
                      transform: isMobile ? 'none' : `rotate(${index === 0 ? '-2deg' : index === 1 ? '2deg' : '-1deg'})`,
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        background: 'rgba(0, 0, 0, 0.6)',
                        borderColor: 'rgba(255, 106, 0, 0.5)',
                        boxShadow: '0 20px 40px rgba(255, 106, 0, 0.3)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 106, 0, 0.1) 100%)',
                        borderRadius: 20,
                        pointerEvents: 'none',
                        zIndex: 1,
                      },
                      [theme.breakpoints.down('md')]: {
                        margin: '8px 0',
                        maxWidth: '100%',
                      },
                    }}
                  >
                    <CardContent sx={{
                      position: 'relative',
                      zIndex: 2,
                      padding: '20px',
                      '&:last-child': {
                        paddingBottom: '20px',
                      },
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: 16 }}>
                          {card.title}
                        </Typography>
                        <Chip 
                          label={card.badge} 
                          sx={{
                            background: 'rgba(255, 106, 0, 0.4)',
                            border: '1px solid rgba(255, 106, 0, 0.6)',
                            color: '#ffeb3b',
                            backdropFilter: 'blur(10px)',
                            fontSize: 10,
                            fontWeight: 600,
                            height: 'auto',
                            padding: '6px 12px',
                            borderRadius: 15,
                            boxShadow: '0 2px 8px rgba(255, 106, 0, 0.3)',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        fontSize: 14, 
                        lineHeight: 1.5 
                      }}>
                        {card.content}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Video Section - Fixed */}
          <Box 
          // sx={{
            // display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
            // marginTop: '50px',
            // marginBottom: '50px',
            // padding: '20px',
            // width: '100%',
            // '& video': {
            //   maxWidth: '100%',
            //   height: 'auto',
            //   borderRadius: '15px',
            //   boxShadow: '0 8px 32px rgba(255, 106, 0, 0.4)',
            //   border: '2px solid rgba(255, 106, 0, 0.3)',
            //   filter: 'drop-shadow(0 4px 20px rgba(255, 106, 0, 0.3))',
            //   [theme.breakpoints.down('md')]: {
            //     maxWidth: '90%',
            //   },
            //   [theme.breakpoints.down('sm')]: {
            //     maxWidth: '95%',
            //   },
            // },
          // }}

          >

            {/* <video 
              autoPlay
              loop
              muted
              playsInline

              // xs={4},
              // sm = {13},
              // md={6},
              // lg = {23},
              // xl = {54},
              
              style={{
                maxWidth: '10000px',
                width: '600px',
                height: '400px',
              }}
              onError={(e) => {
                console.error('Video failed to load:', e);
                // Fallback: hide video or show placeholder
                e.currentTarget.style.display = 'none';
              }}
            >
              <source src="/idea.mp4" type="video/mp4" />
              <source src="./idea.mp4" type="video/mp4" />
              <source src="./public/idea.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video> */}
          </Box>

          
        </Box>
      </Box>
    </>
  );
};

export default LandingPage;