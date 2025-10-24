import React, {createContext, useState} from "react";

export const ProfileContext = createContext();

export const ProfileContextProvider = ({children}) => {

    const [info, setInfo] = useState([]);

    return (
        <ProfileContext.Provider value={{info, setInfo}}>
        {children}
        </ProfileContext.Provider>
    )
}