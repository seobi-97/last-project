import React ,{useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import md5 from 'md5';

function RegisterPage() {
  const { register, watch, formState: {errors}, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit]=useState("");
  const [loading, setLoading] =useState(false);

  const password = useRef();
  password.current = watch("password");

  const onSubmit=async(data)=>{
    try{
      setLoading(true)
      const auth=getAuth();
      let createdUser=await createUserWithEmailAndPassword(auth, data.email,data.password)
      console.log('createdUser',createdUser);

      await updateProfile(auth.currentUser,{
        displayName:data.name,
        photoURL:`http:gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
      })
      //데이터베이스에 저장해주기
      set(ref(getDatabase(), `users/${createdUser.user.uid}`),{
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      })

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
                <h3>회원가입</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input name="email" type="email" {...register("email", {required: true, pattern: /^\S+@\S+$/i})}/>
                {errors.email && <p>This email field is required</p>}
                
                <label>Name</label>
                <input name="name" {...register("name",{required:true, maxLength:10})}/>
                {errors.name && errors.name.type === "required"
                  && <p>This name field is required</p>}
                {errors.name && errors.name.type === "maxLength"
                  && <p>Your input exceed maxinum length</p>}
                
                <label>Password</label>
                <input name="password" type="password" {...register("password", {required:true, pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/})}/>
                {errors.password && errors.password.type === "required" && <p>This name field is required</p>}
                {errors.password && errors.password.type === "pattern" && <p>최소 8자에서 최대 16자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 사용</p>}
                
                <label>Password Confirm</label>
                <input name="password_confirm" type="password" {...register("password_confirm",{required:true, validate:(value)=>value===password.current})}/>
                {errors.password_confirm && errors.password_confirm.type === "required" && <p>This password confirm field is required</p>}
                {errors.password_confirm && errors.password_confirm.type === "validate" && <p>The passwords do not match</p>}
                {errorFromSubmit&&<p>{errorFromSubmit}</p>}
                <input type="submit" disabled={loading}/>
                <Link style={{color:'gray', textDecoration:'none'}} to="/LoginPage">로그인하기</Link>
            </form>
            
        </div>
    )
}

export default RegisterPage;
