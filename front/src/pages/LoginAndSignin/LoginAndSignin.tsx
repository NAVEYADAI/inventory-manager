import { LoginAndSigninContainer } from "./LoginAndSignin.style";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import type { Login, Signup } from "./util";

const LoginAndSignin = () => {
  const [isLogin, setIsLogin] = useState(false);
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

  const sideVariants = {
    hidden: { opacity: 0, x: isLogin ? -100 : 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isLogin ? 100 : -100 },
    transition: { duration: 0.6, ease: "easeInOut" },
  };

  return (
    <LoginAndSigninContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "left-login" : "left-signup"}
          className="left-side"
          variants={sideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {isLogin ? (
            <LogIn setIsLogin={setIsLogin} logIn={logIn} setLogIn={setLogIn} />
          ) : (
            <SignUp
              setIsLogin={setIsLogin}
              signUp={signUp}
              setSignUp={setSignUp}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </LoginAndSigninContainer>
  );
};
export default LoginAndSignin;
