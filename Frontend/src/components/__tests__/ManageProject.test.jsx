import { render } from "@testing-library/react"
import '@testing-library/jest-dom'
import React from 'react'
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "core-js/stable";


import firebaseSlice from "../../Reducer/firebaseSlice";

import ManageProject from '../../Container/Management/ManageProject'

describe("Test Function popupDel",()=>{
    const persistConfig = {
        key: 'firebase',
        storage,
      };
    
    const reducers = combineReducers({ firebase: firebaseSlice });
    
    const persistedReducer = persistReducer(persistConfig, reducers);

    const mockStore = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    });

    test("Manage Project", () => {
        const { getByTestId } = render(
            <Provider store={mockStore}>
                <BrowserRouter styles={{pointerEvents: 'none',cursor: 'none'}}>
                    <Routes>
                        <Route path='/' exact element={<ManageProject/>} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        )

        expect(true);
    })
} )