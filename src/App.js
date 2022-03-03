import React, { useState, useRef, useEffect } from 'react';
import { Container, MainHeader, SubText, InputContainer, UrlInput, CustomButton, ImageContainer, Image, VideoContainer, DisplayResults } from './App.styles';
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
    await setImageVisibility(1);    
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
    ]).catch(err => console.error(err));
    videoRef.current.addEventListener('play',() => {
      setInterval(handleVideo,100)
    })
  }, [])

  const handleImage = async () => {
    const input = imageRef.current;
    const canvas = canvasRef.current;
    canvas.width = input.width;
    canvas.height = input.height;
    const detections = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withAgeAndGender();    
    const resized = await faceapi.resizeResults(detections, { width: input.width, height: input.height });

    resized.forEach( detection => {
      const box = detection.detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
      drawBox.draw(canvas)
    })
  }

  const handleVideo = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.width;
    canvas.height = video.height;
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withAgeAndGender();    
    const resized = await faceapi.resizeResults(detections, { width: video.width, height: video.height });
    console.log(detections);
    resized.forEach( detection => {
      const box = detection.detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
      drawBox.draw(canvas)
    })
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
      <DisplayResults>
        <ImageContainer visibility={imageVisibility}>        
          <Image crossOrigin='anonymous' src={url} alt='' width="720" height="560" ref={imageRef}></Image>   
        </ImageContainer>    
        <VideoContainer visibility={videoVisibility} ref={videoRef} width="720" height="560" autoPlay muted></VideoContainer>
        <canvas width="720" height="560" ref={canvasRef}></canvas>        

      </DisplayResults>      
    </Container>    
  )
}

export default App;
