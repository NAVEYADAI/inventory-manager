import { useState, useEffect } from "react";
import { PageBackground, GlassCard, BannerSide, FormSide } from "./LoginAndSignin.style";
import { motion, AnimatePresence } from "framer-motion";
import { Typography, Stack } from "@mui/material";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import type { Login, Signup } from "./util";
import { GhostButton } from "./LoginAndSignin.style";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const LoginAndSignin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.selectedCompany) {
        navigate("/home");
      } else {
        navigate("/company-picker");
      }
    }
  }, [user, navigate]);

  const [isLogin, setIsLogin] = useState(true); // Default to login screen
  const [logIn, setLogIn] = useState<Login>({ userName: "", password: "" });
  const [signUp, setSignUp] = useState<Signup>({
    userName: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });

  const formAnimationVariants = {
    initial: { opacity: 0, x: isLogin ? -30 : 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isLogin ? 30 : -30 },
  };

  const bannerAnimationVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <PageBackground>
      <GlassCard elevation={0} dir="rtl">
        {/* Banner Section */}
        <BannerSide>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-banner" : "signup-banner"}
              variants={bannerAnimationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              {isLogin ? (
                <Stack spacing={3} alignItems="center">
                  <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
                    ברוכים הבאים!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: "340px", lineHeight: 1.7, fontSize: "1.05rem" }}>
                    הצטרף אלינו היום והתחל לנהל את המלאי והמתכונים של העסק שלך בצורה חכמה, מהירה ומקצועית.
                  </Typography>
                  <GhostButton variant="outlined" onClick={() => setIsLogin(false)}>
                    הרשמה למערכת
                  </GhostButton>
                </Stack>
              ) : (
                <Stack spacing={3} alignItems="center">
                  <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
                    שמחים שחזרת!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: "340px", lineHeight: 1.7, fontSize: "1.05rem" }}>
                    התחבר למשתמש שלך כדי להמשיך לנהל את המלאי, המתכונים, ההזמנות ולוח השנה.
                  </Typography>
                  <GhostButton variant="outlined" onClick={() => setIsLogin(true)}>
                    התחברות למערכת
                  </GhostButton>
                </Stack>
              )}
            </motion.div>
          </AnimatePresence>
        </BannerSide>

        {/* Form Section */}
        <FormSide>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-form-wrapper" : "signup-form-wrapper"}
              variants={formAnimationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35 }}
              style={{ width: "100%" }}
            >
              {isLogin ? (
                <LogIn setIsLogin={setIsLogin} logIn={logIn} setLogIn={setLogIn} />
              ) : (
                <SignUp setIsLogin={setIsLogin} signUp={signUp} setSignUp={setSignUp} />
              )}
            </motion.div>
          </AnimatePresence>
        </FormSide>
      </GlassCard>
    </PageBackground>
  );
};

export default LoginAndSignin;
