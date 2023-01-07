import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConnectFourGame } from '../Game'

const WebRoutes = (props:any) =>{

    return (
      <Routes>
        <Route path="/" element={<Navigate to="/connect-four-game" replace />} />
        <Route path="/connect-four-game" element={<ConnectFourGame />} />
      </Routes>
    );
  }
  export default WebRoutes;

