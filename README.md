# Auolive Chatbot

V0.1.1  27th January 2023  10:00pm

app.py is a bot for use in Auolive project

ChatBot takes in a post to:

[https://auolive.herokuapp.com](https://auolive.herokuapp.com/)

as

[https://auolive.herokuapp.com](https://galileo-ai.herokuapp.com/)/post?prompt={How to keep my face fresh and soft??}

after a while it will give a response as:

```
{"response":"\n\nDrink enough water, staying hydrated is crucial to keeping your skin healthy and moisturized."}
```



Take note when running it for the first time, since Heroku will "wake up" there will be a few seconds delay.

After that, response time should only be delayed by OpenAI API reply.