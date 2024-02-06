import React, { useState, useEffect } from 'react';
import './App.css';
import OpenAI from 'openai';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState('');
  const [listening, setListening] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const recognition = new window.webkitSpeechRecognition();

  recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    setRecognitionContent(transcript.toLowerCase());
  };

  const setRecognitionContent = (transcript) => {
    setUserInput(`<div class="content">${transcript}</div>`);
    takeCommand(transcript);
  };

  const handleUnknownQuestion = async (question) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: question },
        ],
        max_tokens: 20
      });

      console.log('OpenAI API Response:', response);

      const generatedAnswer = response.choices[0]?.message?.content;

      if (generatedAnswer) {
        setJarvisResponse(`<div class="response">${generatedAnswer}</div>`);
        speak(generatedAnswer);
      } else {
        const errorMessage = "Sorry, I couldn't understand your question.";
        const jarvisMessage = `Cheems said: ${errorMessage}`;
        setJarvisResponse(`<div class="response">${jarvisMessage}</div>`);
        speak(jarvisMessage);
      }
    } catch (error) {
      console.error('Error processing an unknown question:', error);
    }
  };

  const openCalculator = () => {
    const userMessage = "You said: Open Calculator";
    setUserInput(`<div class="math-inline">${userMessage}</div>`);

    fetch('http://localhost:3005/openCalculator', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        const jarvisResponse = `Cheems said: ${data.message}`;
        console.log(data.message);
        speak(jarvisResponse);
        setJarvisResponse(`<div class="response">${jarvisResponse}</div>`);
      })
      .catch(error => {
        console.error(`Error opening the calculator: ${error.message}`);
        const errorMessage = "Sorry, I couldn't open the calculator.";
        const jarvisResponse = `Jarvis said: ${errorMessage}`;
        speak(jarvisResponse);
      });
  };

  const openCalendar = () => {
    const userMessage = "You said: Open Calendar";
    setUserInput(`<div class="math-inline">${userMessage}</div>`);

    fetch('http://localhost:3005/openCalendar', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        const jarvisResponse = `Cheems said: ${data.message}`;
        console.log(data.message);
        speak(jarvisResponse);
        setJarvisResponse(`<div class="response">${jarvisResponse}</div>`);
      })
      .catch(error => {
        console.error(`Error opening the calendar: ${error.message}`);
        const errorMessage = "Sorry, I couldn't open the calendar";
        const jarvisResponse = `Jarvis said: ${errorMessage}`;
        speak(jarvisResponse);
      });
  };

  const openSettings = () => {
    const userMessage = "You said: Open Settings";
    setUserInput(`<div class="math-inline">${userMessage}</div>`);

    fetch('http://localhost:3005/openSettings', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        const jarvisResponse = `Cheems said: ${data.message}`;
        console.log(data.message);
        //speak(jarvisResponse);
        setJarvisResponse(`<div class="response">${jarvisResponse}</div>`);
      })
      .catch(error => {
        console.error(`Error opening the settings: ${error.message}`);
        const errorMessage = "Sorry, I couldn't open the settings.";
        const jarvisResponse = `Jarvis said: ${errorMessage}`;
        speak(jarvisResponse);
      });
  };

  const getWeatherData = async () => {
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const city = 'sathyamangalam';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      // Extract relevant weather information from the data object
      const temperature = data.main.temp;
      const weatherDescription = data.weather[0].description;

      // Update UI with weather information
      const weatherMessage = `The current temperature is ${temperature}°C, and the weather is ${weatherDescription}.`;
      setJarvisResponse(`<div class="response">${weatherMessage}</div>`);
      speak(weatherMessage);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const openVSCode = () => {
    const userMessage = "You said: Open Visual Studio Code";
    setUserInput(`<div class="math-inline">${userMessage}</div>`);

    fetch('http://localhost:3005/openVSCode', { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        const jarvisResponse = `Cheems said: ${data.message}`;
        console.log(data.message);
        //speak(jarvisResponse);
        setJarvisResponse(`<div class="response">${jarvisResponse}</div>`);
      })
      .catch(error => {
        console.error(`Error opening Visual Studio Code: ${error.message}`);
        const errorMessage = "Sorry, I couldn't open Visual Studio Code.";
        const jarvisResponse = `Jarvis said: ${errorMessage}`;
        speak(jarvisResponse);
      });
  };

  const takeCommand = (message) => {
    const userMessage = `<span class="math-inline">${message}</span>`;
    setUserInput(`<div class="content">${userMessage}</div>`);

    if (message.includes('hey') || message.includes('hello')) {
      const jarvisResponse = 'Hello Sir, How May I Help You?';
      const jarvisMessage = `<span class="math-inline">${jarvisResponse}</span>`;
      setJarvisResponse(`<div class="response">${jarvisMessage}</div>`);
      speak(jarvisResponse);
    } else if (message.includes('open google') || message.includes('google')) {
      window.open('https://google.com', '_blank');
      speak('Opening Google...');
    } else if (message.includes('open youtube') || message.includes('youtube')) {
      window.open('https://youtube.com', '_blank');
      speak('Opening Youtube...');
    } else if (message.includes('open facebook') || message.includes('facebook') || message.includes('fb')) {
      window.open('https://facebook.com', '_blank');
      speak('Opening Facebook...');
    } else if (message.includes('open instagram') || message.includes('instagram') || message.includes('insta') || message.includes('open insta')) {
      window.open('https://facebook.com', '_blank');
      speak('Opening Facebook...');
    } else if (message.includes('wikipedia') || message.includes('open wikipedia')) {
      window.open(`https://en.wikipedia.org/wiki/${message.replace('wikipedia', '')}`, '_blank');
      const finalText = `This is what I found on Wikipedia regarding ${message}`;
      speak(finalText);
    } else if (message.includes('time')) {
      const time = new Date().toLocaleString(undefined, { hour: 'numeric', minute: 'numeric' });
      const finalText = time;
      speak(finalText);
    } else if (message.includes('mail') || message.includes('open mail')) {
      window.open(`https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox`);
      const finalText = `This is what I found on mail regarding ${message}`;
      speak(finalText);
    } else if (message.includes('date')) {
      const date = new Date().toLocaleString(undefined, { month: 'short', day: 'numeric' });
      const finalText = date;
      speak(finalText);
    } else if (message.includes('linkedin') || message.includes('open linkedin')) {
      window.open(`https://www.linkedin.com/feed/`);
      const finalText = `This is what I found on LinkedIn regarding ${message}`;
      speak(finalText);
    } else if (message.includes('online compiler') || message.includes('open online compiler')) {
      window.open(`https://www.onlinegdb.com/online_c_compiler`);
      const finalText = `This is what I found on the online compiler regarding ${message}`;
      speak(finalText);
    } else if (message.includes('github') || message.includes('open github') || message.includes('open git') || message.includes('open git')) {
      window.open(`https://github.com/`);
      const finalText = `This is what I found on GitHub regarding ${message}`;
      speak(finalText);
    } else if (message.includes('news') || message.includes('what is today\'s news')) {
      window.open(`https://www.thehindu.com/news/national/tamil-nadu/`);
      const finalText = `This is what I found on news regarding ${message}`;
      speak(finalText);
    } else if (message.includes('weather') || message.includes('what is the weather today')) {
      getWeatherData();
    } else if (message.includes('calculator')) {
      speak('Opening Calculator');
      openCalculator();
      // window.open('Calculator:///')
    } else if (message.includes('calendar')) {
      speak('Opening Calendar');
      openCalendar();
      // window.open('Calculator:///')
    } else if (message.includes('vs code') || message.includes('visual studio code')) {
      speak('Opening VS Code');
      openVSCode();
    } else if (message.includes('settings') || message.includes('open settings')) {
      speak('Opening Settings');
      openSettings();
    } else {
      handleUnknownQuestion(message);
    }
  };

  useEffect(() => {
    recognition.continuous = true;

    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        toggleBtn();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      recognition.stop();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const speak = (text) => {
    try {
      if (!window.speechSynthesis) {
        console.error('SpeechSynthesis not supported in this browser.');
        return;
      }
      const text_speak = new SpeechSynthesisUtterance(text);
      text_speak.rate = 1;
      text_speak.volume = 1;
      text_speak.pitch = 1;
      window.speechSynthesis.speak(text_speak);
    } catch (error) {
      console.error('Error in speak function:', error);
    }
  };

  const wishMe = () => {
    console.log('Wishing...');
    var day = new Date();
    var hour = day.getHours();

    if (!window.speechSynthesis) {
      console.error('SpeechSynthesis not supported in this browser.');
      return;
    }

    if (hour >= 0 && hour < 12) {
      speak('Good Morning Bro...');
      console.log('Good Morning Bro...');
    } else if (hour >= 12 && hour < 17) {
      speak('Good Afternoon Bro...');
      console.log('Good Afternoon Bro...');
    } else {
      speak('Good Evening Bro');
      console.log('Good Evening Bro...');
    }
  };

  const toggleBtn = () => {
    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setListening(!listening);
  };  

  return (
    <div className="App">
      <header className="App-header">
        <div className="image">
          <img src="giphy.gif" alt="image" />
        </div>
        <h1>C H E E M S</h1>
        <p>I'm a Virtual Assistant Cheems, How may I help you?</p>
        <button className="button" onClick={toggleBtn}>
          {listening ? 'Stop listening' : 'Start listening'}
        </button>
      </header>
      <main>
        <section className="content-section">
          <h2>User Interaction</h2>
          <div dangerouslySetInnerHTML={{ __html: userInput }} />
          <div dangerouslySetInnerHTML={{ __html: jarvisResponse }} />
        </section>
      </main>
    </div>
  );
};

export default App;
