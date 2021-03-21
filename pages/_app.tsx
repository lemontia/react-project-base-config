import React from 'react'
import App, { AppContext, AppProps } from 'next/app'
import wrapper from '../reducers/configureStore'
import Layout from '../components/layout/Layout'
import { BACKEND_URL } from '../config/config'
import axios from 'axios'
import GlobalStyle from '../styles/global-styles'
import { SET_TOKEN } from '../reducers/userReducer'
import cookies from 'next-cookies'


axios.defaults.withCredentials = true;
axios.defaults.baseURL = BACKEND_URL
axios.defaults.timeout = 10000


const RootApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Layout>
                <GlobalStyle />
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

RootApp.getInitialProps = async (appContext: AppContext) => {
    const { ctx } = appContext;
    const allCookies = cookies(ctx);

    // accessToken 설정
    const accessTokenByCookie = allCookies['accessToken'];    
    if ((accessTokenByCookie === "" || accessTokenByCookie === undefined) === false) {
        axios.defaults.headers.Authorization = "Bearer " + accessTokenByCookie
        ctx.store.dispatch({
            type: SET_TOKEN
            , payload: {
                accessToken: accessTokenByCookie
            }
        })

    }

    const appProps = await App.getInitialProps(appContext)

    return { ...appProps }
}

export default wrapper.withRedux(RootApp)