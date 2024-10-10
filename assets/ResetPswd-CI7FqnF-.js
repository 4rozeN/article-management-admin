import"./request-DzDCiaV-.js";import{a as C,E as R}from"./el-col-D8uDiogD.js";import{E as U,a as B}from"./el-form-item-CZtb7Bkq.js";import{E as q,a as z}from"./el-message-Ca1pJ_aV.js";import{E as F}from"./el-link-Dv3ZEYWQ.js";import{_ as I,u as L,r as p,i as N,b as o,a as s,o as f,c as k,d as g,e as i,f as m,E as y,g as J,m as M,l as E,k as T}from"./index-BGD1WgRO.js";import{b as j,c as A}from"./user-CU8yOTwH.js";import{E as D}from"./index-BeaYeeQ6.js";import"./use-form-common-props-Bx3kOFCg.js";import"./castArray-Q4j2TxHO.js";import"./_baseClone-BSUIHZFx.js";import"./directive-rHe3HdQg.js";const G={class:"user-password"},H={__name:"ResetPswd",setup(K){const V=L(),c=p(!1),u=p(),l=p({email:"",password:"",confirmPassword:"",code:""}),x={email:[{required:!0,message:"邮箱不能为空！",trigger:"change"},{type:"email",message:"邮箱格式不正确！",trigger:"change"}],password:[{required:!0,message:"密码不能为空！",trigger:"change"},{pattern:/^\S{6,16}$/,message:"密码长度必须在6到16个字符之间！",trigger:"change"}],confirmPassword:[{required:!0,message:"密码不能为空！",trigger:"change"},{pattern:/^\S{6,16}$/,message:"密码长度必须在6到16个字符之间！",trigger:"change"},{validator:(t,e,n)=>{e!==l.value.password?n(new Error("两次密码输入不一致！")):n()}}],code:[{required:!0,message:"验证码不能为空！",trigger:"change"}]},b=async()=>{await u.value.validate(),await j(l.value),y.success("密码重置邮件已发送至邮箱，请注意查收"),c.value=!0},P=J(),S=async()=>{await u.value.validate();const t=D.service({lock:!0,text:"Loading",background:"rgba(0, 0, 0, 0.7)"});await A(l.value),t.close(),V.removeJwt(),y.success("密码重置成功，请重新登录"),P.push("/login")};return(t,e)=>{const n=R,r=U,d=q,w=F,v=z,_=B,$=C;return f(),N("div",G,[o($,{class:"pswd-page"},{default:s(()=>[o(n,{span:8}),o(n,{span:8,class:"form"},{default:s(()=>[c.value?(f(),k(_,{key:1,ref_key:"form",ref:u,size:"large"},{default:s(()=>[o(r,{class:"title"},{default:s(()=>e[12]||(e[12]=[g("h1",null,"密码重置",-1)])),_:1}),o(r,{prop:"password"},{default:s(()=>[o(d,{modelValue:l.value.password,"onUpdate:modelValue":e[3]||(e[3]=a=>l.value.password=a),"prefix-icon":i(E),type:"password",placeholder:"请输入新密码"},null,8,["modelValue","prefix-icon"])]),_:1}),o(r,{prop:"confirmPassword"},{default:s(()=>[o(d,{modelValue:l.value.confirmPassword,"onUpdate:modelValue":e[4]||(e[4]=a=>l.value.confirmPassword=a),"prefix-icon":i(E),type:"password",placeholder:"请再次输入新密码"},null,8,["modelValue","prefix-icon"])]),_:1}),o(r,{prop:"code"},{default:s(()=>[o(d,{modelValue:l.value.code,"onUpdate:modelValue":e[5]||(e[5]=a=>l.value.code=a),"prefix-icon":i(T),placeholder:"请输入重置邮件的code校验码"},null,8,["modelValue","prefix-icon"])]),_:1}),o(r,null,{default:s(()=>[o(w,{type:"info",underline:!1,onClick:e[6]||(e[6]=a=>t.$router.go(-1))},{default:s(()=>e[13]||(e[13]=[m(" ← 返回 ")])),_:1}),o(v,{type:"primary",class:"button",onClick:e[7]||(e[7]=a=>S())},{default:s(()=>e[14]||(e[14]=[m("确认")])),_:1})]),_:1})]),_:1},512)):(f(),k(_,{key:0,model:l.value,rules:x,ref_key:"form",ref:u,size:"large",autocomplete:"off"},{default:s(()=>[o(r,{class:"title"},{default:s(()=>e[8]||(e[8]=[g("h1",null,"密码重置",-1)])),_:1}),e[11]||(e[11]=g("p",{style:{"font-size":"small"}},"请输入账号的邮箱地址，我们将发送密码重置邮件",-1)),o(r,{prop:"email"},{default:s(()=>[o(d,{modelValue:l.value.email,"onUpdate:modelValue":e[0]||(e[0]=a=>l.value.email=a),"prefix-icon":i(M),placeholder:"请输入账号的邮箱地址"},null,8,["modelValue","prefix-icon"])]),_:1}),o(r,{class:"flex"},{default:s(()=>[o(w,{type:"info",underline:!1,onClick:e[1]||(e[1]=a=>t.$router.go(-1))},{default:s(()=>e[9]||(e[9]=[m(" ← 返回 ")])),_:1}),o(v,{type:"primary",class:"button",onClick:e[2]||(e[2]=a=>b())},{default:s(()=>e[10]||(e[10]=[m("确认")])),_:1})]),_:1})]),_:1},8,["model"]))]),_:1})]),_:1})])}}},re=I(H,[["__scopeId","data-v-aebefd56"]]);export{re as default};
