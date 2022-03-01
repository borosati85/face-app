import React, { useState, useRef, useEffect } from 'react';
import { Container, MainHeader, SubText, InputContainer, UrlInput, CustomButton, ImageContainer, Image, VideoContainer } from './App.styles';
import * as faceapi from 'face-api.js';
import './App.css';

const App = () => {

  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [imageVisibility, setImageVisibility] = useState(0);
  const [videoVisibility, setVideoVisibility] = useState(0);

  const handleChange = event => {
    setInput(event.target.value);
  }

  const onSubmit = async () => {
    setUrl(input);
    stopVideo();
    setImageVisibility(1);    
    setInput('');
    handleImage();
  }

  const imageRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();

  const startVideo = () => {
    setImageVisibility(0);
    setVideoVisibility(1);
    navigator.getUserMedia(
      { video: {} },
      stream => videoRef.current.srcObject = stream,
      err => console.error(err)
    )    
  }

  const stopVideo = () => {
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks()[0].stop()
    }
    setVideoVisibility(0);
  }

  useEffect(() => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      faceapi.nets.ageGenderNet.loadFromUri('/models')
    ]).then(console.log('loaded'))
    .catch(err => console.error(err))
  }, [])

  const handleImage = async () => {
    const input = imageRef.current;
    const detections = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withAgeAndGender();    
  }

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
        <Image crossOrigin='anonymous' src={url} alt='' width="720" height="560" ref={imageRef}></Image>        
        <canvas width="720" height="560" ref={canvasRef}></canvas>        
      </ImageContainer>      
      <VideoContainer visibility={videoVisibility} ref={videoRef} width="720" height="560" autoPlay muted></VideoContainer>
    </Container>
  )
}

export default App;
