// import React from 'react';
// import {
//   Box,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   useTheme,
//   useMediaQuery,
//   Stack,
//   GlobalStyles,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import CheckIcon from '@mui/icons-material/Check';
// import { useNavigate } from 'react-router-dom';

// // Global styles to reset all margins and padding
// const globalStyles = (
//   <GlobalStyles
//     styles={{
//       '*': {
//         margin: 0,
//         padding: 0,
//         boxSizing: 'border-box',
//       },
//       'html, body': {
//         margin: 0,
//         padding: 0,
//         width: '100%',
//         height: '100%',
//         overflow: 'hidden',
//       },
//       '#root': {
//         margin: 0,
//         padding: 0,
//         width: '100vw',
//         height: '100vh',
//       },
//     }}
//   />
// );

// const FullScreenContainer = styled(Box)({
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   width: '100vw',
//   height: '100vh',
//   margin: 0,
//   padding: 0,
//   background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d1b69 100%)',
//   color: 'white',
//   overflow: 'hidden',
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: `
//       radial-gradient(circle at 20% 80%, rgba(255, 106, 0, 0.15) 0%, transparent 50%),
//       radial-gradient(circle at 80% 20%, rgba(175, 82, 222, 0.1) 0%, transparent 50%),
//       radial-gradient(circle at 40% 40%, rgba(255, 106, 0, 0.08) 0%, transparent 50%)
//     `,
//     pointerEvents: 'none',
//     zIndex: 1,
//   },
// });

// const ContentWrapper = styled(Box)({
//   position: 'relative',
//   zIndex: 2,
//   width: '100%',
//   height: '100%',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: '20px',
//   boxSizing: 'border-box',
// });

// const HeroTextBox = styled(Box)(({ theme }) => ({
//   background: 'rgba(0, 0, 0, 0.4)',
//   backdropFilter: 'blur(20px)',
//   border: '1px solid rgba(255, 255, 255, 0.2)',
//   borderRadius: 30,
//   padding: '40px',
//   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
//   [theme.breakpoints.down('md')]: {
//     padding: '30px 20px',
//   },
// }));

// const GradientText = styled('span')({
//   background: 'linear-gradient(135deg, #ff6a00 0%, #af52de 100%)',
//   WebkitBackgroundClip: 'text',
//   WebkitTextFillColor: 'transparent',
//   backgroundClip: 'text',
// });

// const GlassButton = styled(Button)({
//   backdropFilter: 'blur(10px)',
//   borderRadius: 25,
//   padding: '12px 24px',
//   fontWeight: 600,
//   textTransform: 'none',
//   transition: 'all 0.3s ease',
// });

// const SignupButton = styled(GlassButton)({
//   background: 'rgba(255, 106, 0, 0.8)',
//   color: 'white',
//   border: '1px solid rgba(255, 106, 0, 0.5)',
//   boxShadow: '0 8px 20px rgba(255, 106, 0, 0.3)',
//   '&:hover': {
//     background: 'rgba(255, 106, 0, 0.9)',
//     transform: 'translateY(-2px)',
//     boxShadow: '0 12px 30px rgba(255, 106, 0, 0.4)',
//   },
// });

// const FeatureChip = styled(Chip)({
//   background: 'rgba(0, 0, 0, 0.4)',
//   border: '1px solid rgba(255, 106, 0, 0.3)',
//   color: 'white',
//   backdropFilter: 'blur(10px)',
//   transition: 'all 0.3s ease',
//   margin: '4px',
//   '&:hover': {
//     background: 'rgba(255, 106, 0, 0.2)',
//     borderColor: 'rgba(255, 106, 0, 0.5)',
//     transform: 'translateY(-2px)',
//   },
//   '& .MuiChip-icon': {
//     color: 'white',
//     background: 'rgba(255, 106, 0, 0.8)',
//     borderRadius: '50%',
//     width: 20,
//     height: 20,
//     backdropFilter: 'blur(5px)',
//   },
// });

// const NoteCard = styled(Card)(({ theme }) => ({
//   background: 'rgba(0, 0, 0, 0.5)',
//   border: '1px solid rgba(255, 255, 255, 0.3)',
//   borderRadius: 20,
//   backdropFilter: 'blur(20px)',
//   color: 'white',
//   transition: 'all 0.4s ease',
//   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
//   overflow: 'visible',
//   width: '100%',
//   maxWidth: '280px',
//   margin: '10px',
//   '&:hover': {
//     transform: 'translateY(-8px) scale(1.02)',
//     background: 'rgba(0, 0, 0, 0.6)',
//     borderColor: 'rgba(255, 106, 0, 0.5)',
//     boxShadow: '0 20px 40px rgba(255, 106, 0, 0.3)',
//   },
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 106, 0, 0.1) 100%)',
//     borderRadius: 20,
//     pointerEvents: 'none',
//     zIndex: 1,
//   },
//   [theme.breakpoints.down('md')]: {
//     margin: '8px 0',
//     maxWidth: '100%',
//   },
// }));

// const NoteCardContent = styled(CardContent)({
//   position: 'relative',
//   zIndex: 2,
//   padding: '20px',
//   '&:last-child': {
//     paddingBottom: '20px',
//   },
// });

// const AiBadge = styled(Chip)({
//   background: 'rgba(255, 106, 0, 0.4)',
//   border: '1px solid rgba(255, 106, 0, 0.6)',
//   color: '#ff6a00',
//   backdropFilter: 'blur(10px)',
//   fontSize: 10,
//   fontWeight: 600,
//   height: 'auto',
//   padding: '6px 12px',
//   borderRadius: 15,
//   boxShadow: '0 2px 8px rgba(255, 106, 0, 0.3)',
// });

// const NotesContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   width: '100%',
//   height: '100%',
//   gap: '20px',
//   [theme.breakpoints.up('md')]: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     alignItems: 'flex-start',
//     justifyContent: 'space-around',
//   },
// }));

// const LandingPage: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const navigate = useNavigate();

//   const handleSignup = () => {
//     navigate('/register');
//   };

//   const noteCards = [
//     {
//       title: 'Team Workshop',
//       badge: 'Important',
//       content: 'Quick notes from today\'s meeting. Important decisions and action items captured for easy reference and follow-up...',
//       borderColor: 'rgba(255, 106, 0, 0.6)',
//     },
//     {
//       title: 'Daily Journal',
//       badge: 'Personal',
//       content: 'Personal reflections and thoughts from today. Automatically organized by mood and topics for easy searching...',
//       borderColor: 'rgba(175, 82, 222, 0.6)',
//     },
//     {
//       title: 'Study Notes',
//       badge: 'Academic',
//       content: 'Random thoughts and ideas captured throughout the day. Quick notes help preserve creative moments and insights...',
//       borderColor: 'rgba(255, 106, 0, 0.4)',
//     },
//   ];

//   return (
//     <>
//       {globalStyles}
//       <FullScreenContainer>
//         <ContentWrapper>
//           <Grid 
//             container 
//             spacing={0} 
//             alignItems="center" 
//             sx={{ 
//               width: '100%', 
//               height: '100%',
//               margin: 0,
//               padding: 0,
//               maxWidth: 'none',
//             }}
//           >
//             <Grid 
//               item 
//               xs={12} 
//               md={6} 
//               sx={{ 
//                 padding: isMobile ? '10px' : '20px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <HeroTextBox>
//                 <Typography
//                   variant="h1"
//                   sx={{
//                     fontSize: isMobile ? '2.5rem' : '3.2rem',
//                     fontWeight: 700,
//                     lineHeight: 1.2,
//                     marginBottom: '20px',
//                     color: 'white',
//                   }}
//                 >
//                   Capture <GradientText>brilliance</GradientText>, organize <GradientText>effortlessly</GradientText>
//                 </Typography>
                
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontSize: '1.1rem',
//                     lineHeight: 1.6,
//                     marginBottom: '32px',
//                     color: 'rgba(255, 255, 255, 0.8)',
//                     fontWeight: 400,
//                   }}
//                 >
//                   Elevate your productivity with AI-driven note management. From quick captures to intelligent summaries, make every thought count with seamless organization.
//                 </Typography>

//                 <Box sx={{ marginBottom: '40px' }}>
//                   <FeatureChip icon={<CheckIcon />} label="Smart Organization" />
//                   <FeatureChip icon={<CheckIcon />} label="Markdown Support" />
//                   <FeatureChip icon={<CheckIcon />} label="Quick Access" />
//                   <FeatureChip icon={<CheckIcon />} label="Trash Recovery" />
//                 </Box>

//                 <SignupButton
//                   size="large"
//                   sx={{
//                     fontSize: 18,
//                     padding: '16px 32px',
//                   }}
//                   // onClick={handleSignup}
//                 >
//                   Get Started Today
//                 </SignupButton>
//               </HeroTextBox>
//             </Grid>

//             <Grid 
//               item 
//               xs={12} 
//               md={6}
//               sx={{ 
//                 padding: isMobile ? '10px' : '20px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <NotesContainer>
//                 {noteCards.map((card, index) => (
//                   <NoteCard
//                     key={index}
//                     sx={{
//                       borderLeft: `3px solid ${card.borderColor}`,
//                       transform: isMobile ? 'none' : `rotate(${index === 0 ? '-2deg' : index === 1 ? '2deg' : '-1deg'})`,
//                     }}
//                   >
//                     <NoteCardContent>
//                       <Box sx={{ 
//                         display: 'flex', 
//                         justifyContent: 'space-between', 
//                         alignItems: 'center', 
//                         marginBottom: '16px',
//                         flexWrap: 'wrap',
//                         gap: '8px',
//                       }}>
//                         <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', fontSize: 16 }}>
//                           {card.title}
//                         </Typography>
//                         <AiBadge label={card.badge} />
//                       </Box>
//                       <Typography variant="body2" sx={{ 
//                         color: 'rgba(255, 255, 255, 0.8)', 
//                         fontSize: 14, 
//                         lineHeight: 1.5 
//                       }}>
//                         {card.content}
//                       </Typography>
//                     </NoteCardContent>
//                   </NoteCard>
//                 ))}
//               </NotesContainer>
//             </Grid>
//           </Grid>
//         </ContentWrapper>
//       </FullScreenContainer>
//     </>
//   );
// };

// export default LandingPage;

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
  Stack,
  GlobalStyles,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';

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
        overflow: 'hidden',
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

const FullScreenContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
  margin: 0,
  padding: 0,
  background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d1b69 100%)',
  color: 'white',
  overflow: 'hidden',
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
});

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  boxSizing: 'border-box',
});

const HeroTextBox = styled(Box)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 30,
  padding: '40px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  [theme.breakpoints.down('md')]: {
    padding: '30px 20px',
  },
}));

// New component for the notes-taking animation
const NotesAnimationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '30px',
  opacity: 0.9,
  '& dotlottie-wc': {
    width: '180px',
    height: '180px',
    filter: 'drop-shadow(0 4px 20px rgba(255, 106, 0, 0.3))',
    [theme.breakpoints.down('md')]: {
      width: '140px',
      height: '140px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '120px',
      height: '120px',
    },
  },
}));

const GradientText = styled('span')({
  background: 'linear-gradient(135deg, #ff6a00 0%, #af52de 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
});

const GlassButton = styled(Button)({
  backdropFilter: 'blur(10px)',
  borderRadius: 25,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
});

const SignupButton = styled(GlassButton)({
  background: 'rgba(255, 106, 0, 0.8)',
  color: 'white',
  border: '1px solid rgba(255, 106, 0, 0.5)',
  boxShadow: '0 8px 20px rgba(255, 106, 0, 0.3)',
  '&:hover': {
    background: 'rgba(255, 106, 0, 0.9)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 30px rgba(255, 106, 0, 0.4)',
  },
});

const FeatureChip = styled(Chip)({
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
  '& .MuiChip-icon': {
    color: 'white',
    background: 'rgba(255, 106, 0, 0.8)',
    borderRadius: '50%',
    width: 20,
    height: 20,
    backdropFilter: 'blur(5px)',
  },
});

const NoteCard = styled(Card)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: 20,
  backdropFilter: 'blur(20px)',
  color: 'white',
  transition: 'all 0.4s ease',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
  overflow: 'visible',
  width: '100%',
  maxWidth: '280px',
  margin: '10px',
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
}));

const NoteCardContent = styled(CardContent)({
  position: 'relative',
  zIndex: 2,
  padding: '20px',
  '&:last-child': {
    paddingBottom: '20px',
  },
});

const AiBadge = styled(Chip)({
  background: 'rgba(255, 106, 0, 0.4)',
  border: '1px solid rgba(255, 106, 0, 0.6)',
  color: '#ff6a00',
  backdropFilter: 'blur(10px)',
  fontSize: 10,
  fontWeight: 600,
  height: 'auto',
  padding: '6px 12px',
  borderRadius: 15,
  boxShadow: '0 2px 8px rgba(255, 106, 0, 0.3)',
});

const NotesContainer = styled(Box)(({ theme }) => ({
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
}));

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
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/register');
  };

  // Load the Lottie script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
    script.type = 'module';
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
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
      <FullScreenContainer>
        <ContentWrapper>
          <Grid 
            container 
            spacing={0} 
            alignItems="center" 
            sx={{ 
              width: '100%', 
              height: '100%',
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
              {/* Notes-taking animation above the HeroTextBox */}
              <NotesAnimationContainer>
                <dotlottie-wc 
                  src="https://lottie.host/e93e9514-4c0a-411e-8dab-5738f71c0c58/fnRaBQ7M1Z.lottie"
                  speed="1"
                  autoplay
                  loop
                />
              </NotesAnimationContainer>

              <HeroTextBox>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: isMobile ? '2.5rem' : '3.2rem',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginBottom: '20px',
                    color: 'white',
                  }}
                >
                  Capture <GradientText>brilliance</GradientText>, organize <GradientText>effortlessly</GradientText>
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
                  <FeatureChip icon={<CheckIcon />} label="Smart Organization" />
                  <FeatureChip icon={<CheckIcon />} label="Markdown Support" />
                  <FeatureChip icon={<CheckIcon />} label="Quick Access" />
                  <FeatureChip icon={<CheckIcon />} label="Trash Recovery" />
                </Box>

                <SignupButton
                  size="large"
                  sx={{
                    fontSize: 18,
                    padding: '16px 32px',
                  }}
                  onClick={handleSignup}  
                >
                  Get Started Today
                </SignupButton>
              </HeroTextBox>
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
              }}
            >
              <NotesContainer>
                {noteCards.map((card, index) => (
                  <NoteCard
                    key={index}
                    sx={{
                      borderLeft: `3px solid ${card.borderColor}`,
                      transform: isMobile ? 'none' : `rotate(${index === 0 ? '-2deg' : index === 1 ? '2deg' : '-1deg'})`,
                    }}
                  >
                    <NoteCardContent>
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
                        <AiBadge label={card.badge} />
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        fontSize: 14, 
                        lineHeight: 1.5 
                      }}>
                        {card.content}
                      </Typography>
                    </NoteCardContent>
                  </NoteCard>
                ))}
              </NotesContainer>
            </Grid>
          </Grid>
        </ContentWrapper>
      </FullScreenContainer>
    </>
  );
};

export default LandingPage;
