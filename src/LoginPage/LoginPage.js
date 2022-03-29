import React ,{ useState} from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function LoginPage() {
  const auth = getAuth();
  const { register, formState: {errors}, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit]=useState("");
  const [loading, setLoading] =useState(false);



  const onSubmit=async(data)=>{
    try{
      setLoading(true)
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(false)
    }catch(error){
      setErrorFromSubmit(error.message)
      setLoading(false)
      setTimeout(()=>{
        setErrorFromSubmit("")
      },5000);
    }
  }
    return (
        <div className="auth-wrapper">
            <div style={{textAlign:'center'}}>
                <h3>로그인</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input name="email" type="email" {...register("email", {required: true, pattern: /^\S+@\S+$/i})}/>
                {errors.email && <p>This email field is required</p>}
                
                <label>Password</label>
                <input name="password" type="password" {...register("password", {required:true, pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/})}/>
                {errors.password && errors.password.type === "required" && <p>This name field is required</p>}
                {errors.password && errors.password.type === "pattern" && <p>최소 8자에서 최대 16자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 사용</p>}
                
                {errorFromSubmit&&<p>{errorFromSubmit}</p>}
                <input type="submit" disabled={loading}/>
                <Link style={{color:'gray', textDecoration:'none'}} to="/RegisterPage">회원가입하기</Link>
            </form>
            
        </div>
    )
}

export default LoginPage;
