import React, { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { useNavigate } from 'react-router-dom';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Cookies from 'js-cookie'; // Import js-cookie
import './Login.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API
);

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
      navigate('/success'); 
    }
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          Cookies.set('access_token', session.access_token, { expires: 1 }); 
          navigate('/success');
        }
      } else if (event === 'SIGNED_OUT') {
        Cookies.remove('access_token');
        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="container">
      <div className="form-container">
        <h2>Login</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme='dark'
          providers={["discord"]}
        />
      </div>
    </div>
  );
}

export default Login;
