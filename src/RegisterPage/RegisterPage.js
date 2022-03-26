import React from 'react';
import { Link } from 'react-router-dom';
import { useform } from 'react-hook-form';
function RegisterPage() {
  const { register, watch, errors } = useForm({mode: "onChange"});
  const password = useRef();
  password.current = watch("password");

  console.log(watch("password"));
    return (
        <div className="auth-wrapper">
            <div style={{textAlign:'center'}}>
                <h3>회원가입</h3>
            </div>
            <form>
                <label>Email</label>
                <input name="email" type="email" ref={register({required: true, pattern: /^\S+@\S+$/i})}/>
                {errors.email && <p>This email field is required</p>}
                
                <label>Name</label>
                <input name="name" ref={register({required:true, maxLength:10})}/>
                {errors.name && errors.name.type === "required"
                  && <p>This name field is required</p>}
                {errors.name && errors.name.type === "maxLength"
                  && <p>Your input exceed maxinum length</p>}
                
                <label>Password</label>
                <input name="password" type="password" ref={register({required:true, pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/})}/>
                {errors.password && errors.password.type === "required" && <p>This name field is required</p>}
                {errors.password && errors.password.type === "pattern" && <p>최소 8자에서 최대 16자, 최소 하나의 문자, 하나의 숫자 및 하나의 특수 문자 사용</p>}
                
                <label>Password Confirm</label>
                <input name="password_confirm" type="password" ref={register({required:true, validate:(value)=>value===password.current})}/>
                {errors.password_confirm && errors.password_confirm.type === "required" && <p>This password confirm field is required</p>}
                {errors.password_confirm && errors.password_confirm.type === "validate" && <p>The passwords do not match</p>}
                <input type="submit"/>
            </form>
            <Link style={{color:'gray', textDecoration:'none'}} to="/LoginPage">이미 아이디가 있다면..</Link>
        </div>
    )
}

export default RegisterPage;
