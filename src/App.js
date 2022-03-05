import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, MainHeader, SubText, InputContainer, UrlInput, CustomButton, ImageContainer, Image, VideoContainer, DisplayResults, CanvasContainer } from './App.styles';
import * as faceapi from 'face-api.js';
import './App.css';

const App = () => {

  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [imageVisibility, setImageVisibility] = useState(0);
  const [videoVisibility, setVideoVisibility] = useState(0);
  const [canvasVisibility, setCanvasVisibility] = useState(0);
  const [videoIntervalId, setVideoIntervalId] = useState('');

  const handleChange = event => {
    setInput(event.target.value);
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  const onSubmit = async () => {
    clearCanvas();
    setUrl(input);
    await stopVideo();
    await setCanvasVisibility(1);
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
    setCanvasVisibility(1);
    navigator.getUserMedia(
      { video: {} },
      stream => videoRef.current.srcObject = stream,
      err => console.error(err)
    )    
  }

  const stopVideo = async () => {
    const video = videoRef.current;
    if (video.srcObject) {
      await video.srcObject.getTracks()[0].stop()
    }
    await clearInterval(videoIntervalId);
    await setVideoVisibility(0); 
    setCanvasVisibility(0); 
  }

  const handleImage = async () => {
    console.log('start');
    console.log(faceapi);
    const input = imageRef.current;
    const canvas = canvasRef.current;
    canvas.width = input.width;
    canvas.height = input.height;
    
    const detections = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withAgeAndGender(); 
    console.log(detections);   
    const resized = await faceapi.resizeResults(detections, { width: input.width, height: input.height });
    resized.forEach( detection => {
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
      drawBox.draw(canvas)
    })
  }

  const handleVideo = useCallback(() => {
    if (videoIntervalId) {
      clearInterval(videoIntervalId);
    }
    
    const currentVideoIntervalId = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.width;
      canvas.height = video.height;
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withAgeAndGender();    
      const resized = await faceapi.resizeResults(detections, { width: video.width, height: video.height });
      resized.forEach( detection => {
        const box = detection.detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
        drawBox.draw(canvas)
      },100)
    });

    setVideoIntervalId(currentVideoIntervalId);
  },[videoIntervalId]);

  useEffect(() => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
    ]).then(console.log('loaded')).catch(err => console.error(err));

    const video = videoRef.current;

    video.addEventListener('play',handleVideo);

    return (()=> {
      video.removeEventListener('play', handleVideo);
    })
  }, [handleVideo])

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
          <Image crossOrigin='anonymous' src={url} alt='' width="720" height="480" ref={imageRef}></Image>   
        </ImageContainer>    
        <VideoContainer visibility={videoVisibility} width="720" height="480" ref={videoRef} autoPlay muted></VideoContainer>
        <CanvasContainer visibility={canvasVisibility} width="720" height="480" ref={canvasRef}></CanvasContainer>
      </DisplayResults>      
    </Container>    
  )
}

export default App;
