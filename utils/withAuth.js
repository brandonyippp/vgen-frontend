// withAuth.js
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const signInState = useSelector((state) => {
      return state.signIn.body;
    });

    useEffect(() => {
      const isUserSignedIn = signInState.username && signInState.password;

      if (!isUserSignedIn) {
        router.push("/signup");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
