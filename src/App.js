import React, { useState, useRef, useEffect } from 'react';
import { Container, MainHeader, SubText, InputContainer, UrlInput, CustomButton, ImageContainer, Image, VideoContainer } from './App.styles';
import { FaceLandmark68Net, FaceRecognitionNet, FaceExpressionNet, tinyFaceDetector } from 'face-api.js';
import './App.css';

const App = () => {

  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [imageVisibility, setImageVisibility] = useState(0);
  const [videoVisibility, setVideoVisibility] = useState(0);

  const handleChange = event => {
    setInput(event.target.value);
  }

  const onSubmit = () => {
    setUrl(input);
    imageVisibility(1);
    setInput('');
    requestFaceDetection(url);
  }

  const requestFaceDetection = async url => {
    fetch("https://face-detection6.p.rapidapi.com/img/face-age-gender", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "x-rapidapi-host": "face-detection6.p.rapidapi.com",
        "x-rapidapi-key": "fa104ef45bmshf1442b521025b33p199be2jsnd01a408dc4ba"
      },
      "body": {
        "url": "https://inferdo.com/img/face-3.jpg",
        "accuracy_boost": 3
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.error(err);
    });
  }

  const videoRef = useRef()

  const startVideo = () => {
    setVideoVisibility(1);
    navigator.getUserMedia(
      { video: {} },
      stream => videoRef.current.srcObject = stream,
      err => console.error(err)
    )    
  }

  const stopVideo = () => {
    videoRef.current.srcObject.getTracks()[0].stop()
    setVideoVisibility(0);
  }

  useEffect(() => {
    const tfg = async () => {
      const facedetector = await tinyFaceDetector();
      console.log(facedetector);
    }
    tfg();
    console.log(FaceLandmark68Net);
    console.log(FaceRecognitionNet);
    console.log(FaceExpressionNet);
  })

  return (
    <Container>
      <MainHeader>Face Recognition App</MainHeader>
      <SubText>Please enter an URL</SubText>
      <InputContainer className='input-container'>
        <UrlInput type='text' onChange={handleChange} value={input}></UrlInput>
        <CustomButton onClick={onSubmit}>Upload</CustomButton>        
      </InputContainer>
      <SubText>or try real time face detection</SubText>
      {
        videoVisibility
        ? <CustomButton onClick={stopVideo}>Stop Camera</CustomButton>
        : <CustomButton onClick={startVideo}>Start Camera</CustomButton>      
      }      
      <ImageContainer visibility={imageVisibility}>
        <Image src={url} alt='uploaded'></Image>
      </ImageContainer>
      <VideoContainer visibility={videoVisibility} ref={videoRef} width="720" height="560" autoPlay muted></VideoContainer>
    </Container>
  )
}

export default App;
