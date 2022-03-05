import styled from "styled-components";

export const Container = styled.div`
    box-sizing: border-box;
    background-color: #444;  
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    font-family: 'Montserrat', sans-serif;    
 `
  
 export const MainHeader = styled.h1`
    color: rgb(80, 240, 140);
    font-weight: 100;
    text-align: center;
    font-size: 30px;

    @media only screen and (min-width: 280px) {
        font-size: 45px;
    }

    @media only screen and (min-width: 481px) {
        font-size: 60px;
    } 
`
  
export const SubText = styled.p`
    color: #999
`
  
export const InputContainer = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;

    @media only screen and (min-width: 481px) {
        flex-direction: row;
    }
`
  
export const UrlInput = styled.input`
    width: 270px;
    height: 40px;
    outline: none;
    border-radius: 50px;
    border: none;
    text-align: center;
    font-size: 20px;

    @media only screen and (min-width: 481px) {
        width: 230px;
    }
`
  
export const CustomButton = styled.button`
    width: 270px;
    height: 40px;
    border-radius: 50px;
    border: none;
    font-weight: 400;
    background-color: rgb(80, 240, 140);
    cursor: pointer;

    @media only screen and (min-width: 481px) {
        width: 100px;
    }
`

const setVisibility = ({visibility}) => visibility ? 'block' : 'none'

export const ImageContainer = styled.div`
    display: ${setVisibility};
`

export const Image = styled.img`
    max-width: 95vw;
    height: auto;
`

export const VideoContainer = styled.video`
    max-width: 95vw;
    height: auto;
    display: ${setVisibility}
`

export const DisplayResults = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const CanvasContainer = styled.canvas`
    position: absolute;
    top: 0;
    max-width: 95vw;
    height: auto;
    display: ${setVisibility};
`