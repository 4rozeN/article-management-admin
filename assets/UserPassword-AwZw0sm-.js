import"./request-DzDCiaV-.js";import{a as C,E as $}from"./el-col-D8uDiogD.js";import{E as B}from"./el-link-Dv3ZEYWQ.js";import{E as q,a as R}from"./el-form-item-CZtb7Bkq.js";import{E as z,a as F}from"./el-message-Ca1pJ_aV.js";import{_ as I,u as L,r as m,i as N,b as o,a as s,o as p,c as v,d as f,e as d,f as c,E as k,g as J,m as M,l as E,k as G}from"./index-BGD1WgRO.js";import{d as T,b as j,c as A}from"./user-CU8yOTwH.js";import{E as D}from"./index-BeaYeeQ6.js";import"./use-form-common-props-Bx3kOFCg.js";import"./castArray-Q4j2TxHO.js";import"./_baseClone-BSUIHZFx.js";import"./directive-rHe3HdQg.js";const H={class:"user-password"},K={__name:"UserPassword",setup(O){const y=L(),g=m(!1),n=m(),a=m({email:"",password:"",confirmPassword:"",code:""}),V={email:[{required:!0,message:"邮箱不能为空！",trigger:"change"},{type:"email",message:"邮箱格式不正确！",trigger:"change"}],password:[{required:!0,message:"密码不能为空！",trigger:"change"},{pattern:/^\S{6,16}$/,message:"密码长度必须在6到16个字符之间！",trigger:"change"}],confirmPassword:[{required:!0,message:"密码不能为空！",trigger:"change"},{pattern:/^\S{6,16}$/,message:"密码长度必须在6到16个字符之间！",trigger:"change"},{validator:(u,e,t)=>{e!==a.value.password?t(new Error("两次密码输入不一致！")):t()}}],code:[{required:!0,message:"验证码不能为空！",trigger:"change"}]},x=async()=>{await n.value.validate(),await T(),await j(a.value),k.success("密码重置邮件已发送至邮箱，请注意查收"),g.value=!0},P=J(),S=async()=>{await n.value.validate();const u=D.service({lock:!0,text:"Loading",background:"rgba(0, 0, 0, 0.7)"});await A(a.value),u.close(),y.removeJwt(),k.success("密码重置成功，请重新登录"),P.push("/login")};return(u,e)=>{const t=$,l=q,i=z,w=F,_=R,b=B,U=C;return p(),N("div",H,[o(U,{class:"pswd-page"},{default:s(()=>[o(t,{span:8}),o(t,{span:8,class:"form"},{default:s(()=>[g.value?(p(),v(_,{key:1,ref_key:"form",ref:n,size:"large"},{default:s(()=>[o(l,{class:"title"},{default:s(()=>e[10]||(e[10]=[f("h1",null,"密码重置",-1)])),_:1}),o(l,{prop:"password"},{default:s(()=>[o(i,{modelValue:a.value.password,"onUpdate:modelValue":e[2]||(e[2]=r=>a.value.password=r),"prefix-icon":d(E),type:"password",placeholder:"请输入新密码"},null,8,["modelValue","prefix-icon"])]),_:1}),o(l,{prop:"confirmPassword"},{default:s(()=>[o(i,{modelValue:a.value.confirmPassword,"onUpdate:modelValue":e[3]||(e[3]=r=>a.value.confirmPassword=r),"prefix-icon":d(E),type:"password",placeholder:"请再次输入新密码"},null,8,["modelValue","prefix-icon"])]),_:1}),o(l,{prop:"code"},{default:s(()=>[o(i,{modelValue:a.value.code,"onUpdate:modelValue":e[4]||(e[4]=r=>a.value.code=r),"prefix-icon":d(G),placeholder:"请输入重置邮件的code校验码"},null,8,["modelValue","prefix-icon"])]),_:1}),o(l,null,{default:s(()=>[o(b,{type:"info",underline:!1,onClick:e[5]||(e[5]=r=>u.$router.go(-1))},{default:s(()=>e[11]||(e[11]=[c(" ← 返回 ")])),_:1}),o(w,{type:"primary",class:"button",onClick:e[6]||(e[6]=r=>S())},{default:s(()=>e[12]||(e[12]=[c("确认")])),_:1})]),_:1})]),_:1},512)):(p(),v(_,{key:0,model:a.value,rules:V,ref_key:"form",ref:n,size:"large",autocomplete:"off"},{default:s(()=>[o(l,{class:"title"},{default:s(()=>e[7]||(e[7]=[f("h1",null,"密码重置",-1)])),_:1}),e[9]||(e[9]=f("p",{style:{"font-size":"small"}},"请输入账号的邮箱地址，我们将发送密码重置邮件",-1)),o(l,{prop:"email"},{default:s(()=>[o(i,{modelValue:a.value.email,"onUpdate:modelValue":e[0]||(e[0]=r=>a.value.email=r),"prefix-icon":d(M),placeholder:"请输入账号的邮箱地址"},null,8,["modelValue","prefix-icon"])]),_:1}),o(l,{class:"flex"},{default:s(()=>[o(w,{type:"primary",class:"button",onClick:e[1]||(e[1]=r=>x())},{default:s(()=>e[8]||(e[8]=[c("确认")])),_:1})]),_:1})]),_:1},8,["model"]))]),_:1})]),_:1})])}}},te=I(K,[["__scopeId","data-v-89a3646e"]]);export{te as default};
