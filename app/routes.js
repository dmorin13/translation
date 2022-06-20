const mongoose = require("mongoose");
const axios = require("axios");

module.exports = function (app, passport, db) {
  // normal routes ===============================================================

  // show the home page (will also have our login links)
  //
  app.get("/", function (req, res) {
    res.render("home.ejs");
  });


  // PROFILE SECTION =========================
  app.get("/teacher_profile", isLoggedIn, async function (req, res) {
    const messages = await db.collection("messages").find().toArray();
    const comments = await db.collection("comments").find().toArray();

    //loop through comments for translation
    for (let i = 0; i < comments.length; i++) {

      // @TODO: Map langPref from long language name (e.g. "Spanish") to two-letter language name (e.g. 'es')

      const langPref = comments[i].langPref;           
      const langPrefTwoLetter = languageMap[langPref];
      
      let commentsLP = comments[i].commentText;

      console.log({ msg: "Before invoking tanslateAsync", currentComment: comments[i], commentsLP, langPref, langPrefTwoLetter })

      comments[i].commentText = await translateAsync(
        commentsLP,
        langPrefTwoLetter,
        true
      );
      console.log({ msg: "After invoking tanslateAsync", currentComment: comments[i], commentsLP, langPref, langPrefTwoLetter })
    }

    res.render("teacher_profile.ejs", {
      user: req.user,
      messages: messages,
      comments: comments,
      // commentId: id,
    });
  });

  //   //communicating w/ DB
  //   db.collection("messages")
  //     .find()
  //     .toArray((err, messages) => {
  //       if (err) return console.log(err);

  //       db.collection("comments")
  //       .find()
  //      .toArray((err, comments) => {
  //       if (err) return console.log(err);
  //       res.render("teacher_profile.ejs", {
  //         "user": req.user,
  //         "messages": messages,
  //         "comments": comments
  //       });
  //     });
  //   // console.log(messages)
  // });

  app.get("/parent_profile", isLoggedIn, function (req, res) {
    if (req.user.role !== "parent") {
      res.redirect("/");
    }
    db.collection("messages")
      .find()
      .toArray((err, messages) => {
        // console.log(req.user); //req.user._id
        if (err) return console.log(err);

        res.render("parent_profile.ejs", {
          //"mapping "user" to "req.user" and "messages" to "messages"
          currentUser: req.user,
          messages: messages,
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // message board routes ===============================================================

  app.get("/translate", async (req, res) => {
    //pulling id and lang out of the query object from the fetch call
    const id = req.query.id;
    const lang = req.query.lang;
    //mongo ID's are objects of type="ObjectID", custom type define by Mongo/mongoose
    //new keyword calls a constuctor to create a new instance
    const message = await db
      .collection("messages")
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    // console.log({ message });

    const translationResult = await translateAsync(message.msg, lang);

    // const translationResultPT = await translateAsync(message.msg, lang)

    // console.log({ translationResult });

    res.status(200).send(translationResult);
  });

  app.get("/translatePT", async (req, res) => {
    //pulling id and lang out of the query object from the fetch call
    const id = req.query.id;
    const lang = req.query.lang;
    //mongo ID's are objects of type="ObjectID", custom type define by Mongo/mongoose
    //new keyword calls a constuctor to create a new instance
    const message = await db
      .collection("messages")
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    // console.log({ message });

    // const translationResult = await translateAsync(message.msg, lang);

    const translationResultPT = await translateAsync(message.msg, lang);

    // console.log({ translationResultPT });

    res.status(200).send(translationResultPT);
  });

  app.get("/translateHT", async (req, res) => {
    //pulling id and lang out of the query object from the fetch call
    const id = req.query.id;
    const lang = req.query.lang;
    //mongo ID's are objects of type="ObjectID", custom type define by Mongo/mongoose
    //new keyword calls a constuctor to create a new instance
    const message = await db
      .collection("messages")
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    // console.log({ message });

    // const translationResult = await translateAsync(message.msg, lang);

    const translationResultHT = await translateAsync(message.msg, lang);

    // console.log({ translationResultHT });

    res.status(200).send(translationResultHT);
  });

  app.get("/translateSO", async (req, res) => {
    //pulling id and lang out of the query object from the fetch call
    const id = req.query.id;
    const lang = req.query.lang;
    //mongo ID's are objects of type="ObjectID", custom type define by Mongo/mongoose
    //new keyword calls a constuctor to create a new instance
    const message = await db
      .collection("messages")
      .findOne({ _id: new mongoose.Types.ObjectId(id) });

    // console.log({ message });

    // const translationResult = await translateAsync(message.msg, lang);

    const translationResultSO = await translateAsync(message.msg, lang);

    // console.log({ translationResultSO });

    res.status(200).send(translationResultSO);
  });


  // Map to help us go from long names to ISO two-letter language names
  const languageMap = {
    "Spanish": "es",
    "Portuguese": "pt", 
    "Somali": "so", 
    "Haitian Creole": "ht"
  };

  async function translateAsync(message, language, toEnglish = false) {
    //axios
    let translateFrom;
    let translateTo;

    if (toEnglish) {
      // let language = "es"
      translateFrom = encodeURIComponent(language);
      translateTo = "en";
    } else {
      translateFrom = "en";
      translateTo = encodeURIComponent(language);
    }
    console.log({ msg: "in: translateAsync(...) - language vars", language, translateFrom, translateTo })
    
    const urlEncodedMessage = encodeURIComponent(message);
    const developerEmailAddress = encodeURIComponent("jason.makhlouta+memapi@gmail.com"); 
    const translationApiEndpoint = `https://api.mymemory.translated.net/get?langpair=${translateFrom}|${translateTo}&q=${urlEncodedMessage}&de=${developerEmailAddress}`;
    console.log({ msg: "in: translateAsync(...) - url", translationApiEndpoint })

    const translationResult = await axios.get(translationApiEndpoint);
    const translationData = translationResult?.data?.responseData; 
    console.log({ msg: "in: translateAsync(...) - results", translationData });

    return translationData;
  }
    
    //  `https://api.mymemory.translated.net/get?langpair=es|en&q=${encodeURIComponent(message)}`

    //  `https://api.mymemory.translated.net/get?langpair=ht|${encodeURIComponent(language)}&q=${encodeURIComponent(message)}`

    //  `https://api.mymemory.translated.net/get?langpair=pt|${encodeURIComponent(language)}&q=${encodeURIComponent(message)}`

    //  `https://api.mymemory.translated.net/get?langpair=so|${encodeURIComponent(language)}&q=${encodeURIComponent(message)}`

    //axios helps make a get request to the mymemory API at the translate endpoint
    //const translationResult = await axios.get(translationApiEndpoint);
    // var responseData;
    // const translationResult = await axios
    //   .get(translationApiEndpoint)
    //   .then((res) => (responseData = res?.data?.responseData))
    //   .catch(
    //     (err) => {
    //   return console.log(err);
    //     }
    //   )
    //     if (message in translationTable){
    //       responseData = {translatedText: translationTable[message][translateTo]}
    //   }else{
    //     responseData ={translatedText: "I had a question about Juan's homework"}
    //   }
    // }
      

    //UNCOMMENT 204 AFTER DEBUGGIN!
    
    //  console.log("ANSWER LABEL:", {translationApiEndpoint, responseData });

  //Tenia una pregunta sobre la tarea de Juan
  //"I had a question about Juan's homework"
  //"Waxaan qabay su'aal ku saabsan shaqada guriga ee Juan"

  //"Today we are learning about methods!"
  //"¡Hoy estamos aprendiendo sobre métodos!"
  //"Maanta waxaan baraneynaa hababka!"
  // let translationTable = {
  //   "Today we are learning about methods!": {
  //     es: "¡Hoy estamos aprendiendo sobre métodos!",
  //     so: "Maanta waxaan baraneynaa hababka!",
  //   }, 
  //   "Tenia una pregunta sobre la tarea de Juan":{
  //     en: "I had a question about Juan's homework"
  //   }
  // };
  

  app.post("/parent_messages", (req, res) => {
    db.collection("messages").save(
      {
        name: req.body.name,
        role: req.body.role,
        msg: req.body.msg,
        read: false,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log("saved to database");
        res.redirect("/profile_parent");
      }
    );
  });

  app.post("/teacher_messages", (req, res) => {
    // console.log({ msg: "post to /teacher_messages", user: req.user });
    db.collection("messages").save(
      {
        name: req.body.name,
        role: req.body.role,
        msg: req.body.msg,
        read: false,
      },
      (err, result) => {
        if (err) return console.log(err);

        console.log("saved to database");
        res.redirect("/teacher_profile");
      }
    );
  });

  app.put("/messages", (req, res) => {
    db.collection("messages").findOneAndUpdate(
      //query specification
      //field : request body contents
      //TEMPLATE FOR COMMENT ID?
      { _id: new mongoose.Types.ObjectId(req.body.id) },
      {
        $set: {
          read: req.body.isRead,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
    );
  });

  app.post("/comments", (req, res) => {
    //define obj = field name : value
    let parentComments = {
      userId: req.body.user_id,
      
      posterName: req.body.name,
      commentText: req.body.msg,
      teacherPostId: req.body.announcementId,
      langPref: req.body.langPref,
    };
    // console.log(teacherPostId)

    console.log({ MSG: "IMPORTANT", parentComments, requestBody: req.body})

    db.collection("comments").insertOne(
      //form inputs (EJS) ---> field inside the request body
      parentComments,

      (err, result) => {
        //sending to the client
        //if not falsy then,
        if (err) return res.send(err);
        //redirect to teacher_profile, if teacher is posting comment from teacher_profile
        res.redirect("/parent_profile");
      }
    );
  });


  app.delete("/messages", (req, res) => {
    db.collection("messages").findOneAndDelete(
      { _id: new mongoose.Types.ObjectId(req.body.id) },
      (err, result) => {
        if (err) return res.send(500, err);
        res.send("Message deleted!");
      }
    );
  });


  app.delete("/comments", (req, res) => {
    db.collection("comments").findOneAndDelete(
      { _id: new mongoose.Types.ObjectId(req.body.id) },
      (err, result) => {
        if (err) {
          console.log("error");
          return res.send(500, err);
        }
        res.send("Comment deleted!");
         console.log("Comment deleted")
      }
    );
  });
  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login_parent", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  app.get("/login_teacher", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login_parent",
    passport.authenticate("local-login", {
      successRedirect: "/parent_profile", // redirect to the secure profile section
      failureRedirect: "/login_parent", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // process the login form
  app.post(
    "/login_teacher",
    passport.authenticate("local-login", {
      successRedirect: "/teacher_profile", // redirect to the secure profile section
      failureRedirect: "/login_teacher", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.name =undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
