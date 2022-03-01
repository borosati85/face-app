import styled from "styled-components";

export const Container = styled.div`
    box-sizing: border-box;
    background-color: #444;  
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    font-family: 'Montserrat', sans-serif;
 `
  
 export const MainHeader = styled.h1`
    color: rgb(80, 240, 140);
    font-weight: 100;
    font-size: 60px;
`
  
export const SubText = styled.p`
    color: #999
`
  
export const InputContainer = styled.div`
    display: flex;
    gap: 10px;
`
  
export const UrlInput = styled.input`
    width: 230px;
    height: 40px;
    outline: none;
    border-radius: 50px;
    border: none;
    text-align: center;
    font-size: 20px;
`
  
export const CustomButton = styled.button`
    width: 100px;
    height: 40px;
    border-radius: 50px;
    border: none;
    font-weight: 400;
    background-color: rgb(80, 240, 140);
    cursor: pointer;
`

const setVisibility = ({visibility}) => visibility ? 'flex' : 'none'

export const ImageContainer = styled.div`
    display: ${setVisibility}
`

export const Image = styled.img`
    height: 500px;
    width: auto;
`

export const VideoContainer = styled.video`
    display: ${setVisibility}
`