
import React, {useState} from "react";
import AuthPresenter from "./AuthPresenter";
import useInput from "../../Hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN, CREATE_ACCOUNT, CONFIRM_SECRET, LOCAL_LOG_IN } from "./AuthQueries";
import {toast} from "react-toastify";

export default () => {
    const [action, setAction] = useState("logIn");
    const username = useInput("");
    const firstName = useInput("");
    const lastName = useInput("");
    const secret = useInput("");
    const email = useInput("gentlebae@gmail.com");
    const [requestSecretMutation] = useMutation(LOG_IN, {
        variables: { email: email.value },
    });

    const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
        variables: {
            email: email.value,
            username: username.value,
            firstName: firstName.value,
            lastName: lastName.value
        }
    });

    const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
        variables: {
            email: email.value,
            secret: secret.value
        }
    });

    const [localLoginMutation] = useMutation(LOCAL_LOG_IN);


    const onSubmit = async (e) => {
        e.preventDefault();
        if(action === "logIn"){
            if(email.value !== ""){
                try{
                    const {data:{requestSecret}} = await requestSecretMutation();
                    console.log(requestSecret);
                    if(!requestSecret) {
                        toast.error("You dont have an account yet, create one");
                        setTimeout(()=> setAction("signUp"), 20);
                    }else{
                        toast.success("Check your Email Inbox for your SECRET CODE");
                        setAction("confirm");
                    }
                }catch{
                    toast.error("Cannot request secret, try again");
                }
            } else{
                toast.error("Email is Required");
            }
        }else if(action=== "signUp"){
            if(email.value !=="" && username.value !=="" && firstName.value !== "" && lastName.value !==""){
                try{
                    const {data:{createAccount}} = await createAccountMutation();
                    if(!createAccount){
                        toast.error("Cant create account");
                    }else{
                        toast.success("Account Created. Login now");
                        setTimeout(() => setAction("logIn"), 3000);
                    }
                }catch(e){
                    toast.error(e.message);
                }

            }else{
                toast.error("All fields are required");
            }
        }else if(action === "confirm"){
            if(secret.value !== ""){
                try{
                    const {data: { confirmSecret: token }} = await confirmSecretMutation();
                    // Above, create token and put confirmSecret into token
                    if(token !=="" && token !== undefined){
                        localLoginMutation({variables: {token} });
                    }else {
                        throw Error();
                    }
                }catch{
                    toast.error("Cannot confirm secret");
                }
            }
        }

    }

    console.log(username, firstName, lastName, email);

    return <AuthPresenter setAction={setAction} action={action} username={username} 
        firstName={firstName} lastName={lastName} email={email} secret={secret}
        onSubmit={onSubmit}
    />

}
;