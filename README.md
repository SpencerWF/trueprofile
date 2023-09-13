*This was a project to take the state of a streamer from Twitch.tv and use it to update the Twitter profile of that streamer.  This project was not completed due to the API changes of Twitter.*

To update a twitter profile picture requried the twitter api path 'https://api.twitter.com/1.1/account/update_profile_image.json'.  Which has been deprecated as of May 2023.

As such this is now just an example project I will refer back to sometimes when needed, all secrets have been removed.

# True Profile
Service to update Social Media profiles to reflect live information.

Connects to the repository 'trueprofile_frontend'.

Uses Nodejs on the backend, and Angular on the frontend.

# Pricing Structure

| Tier | Cost | Functionality |
|------|------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Free | Free | When a user goes live on Twitch their Twitter profile is grabbed from Twitter, a red 'live' circle is added to the image and it is reuploaded to Twitter, and 'Live Now' is added to their current profile description |
| User | ~$3 | A user can choose a custom live and offile image, and description, when they go live/offline the profile image and description is swapped automatically |
| Power User | ~$10 | A user at this tier can create a different set of profile image and profile description for any game that twitch recognizes |

# API Reference
## Streamer

### /api/streamer/

## Profile

### get /api/profile/id/
API route which identifies the user, and looks for the list of profiles associated with that user. Authentication goes through Auth0, and does not require a id number, their id is grabbed through Auth0's authentication payload.

### get /api/profile/id/image/:image
Each profile has an associated image, which is the image that a user's Twitter profile image will change to upon going live (and for a power user selecting the correct game for that profile).  This path is to grab that image from the server using the image file name, which is provided in the SQL database.

### post /api/profile/id/profile
This route is used to create a new profile for the particular user, at the Free and User tiers it is only used when first creating the user, for a Power User it is also used for each new profile that user creates.

### put /api/profile/:streamerid/profile/profile/:profileid
An API path which was used to add single profile from the database using the streamer id and the profile id, but after the initiation of using Auth0 on True Profile this path stopped being used.

### delete /api/profile/id/profile
This is the path used to delete a specific user's proifle, primarily used for Power Users when they delete a profile no longer in use. 

# Service Reference

## Streamer Class
An instance of this class is created for each user, then used to control all database communication and hold an associated instance of the Twitch_Streamer class and manage direct the Twitter side communication.

## Twitch
The Twitch.tv API functionality is defined in a single folder called 'twitch' which uses the Twitch.tv API library called '[Twurple](https://twurple.js.org/)'.  When the server is first started an automatically refreshing AuthProvider is created which manages all of the direct requests to the Twitch API. 

### init_listener
This function is used to initialize the listener, specifically for subscribing to events from the Twitch.tv API.

### list_twitch_subscriptions
During debugging and testing this function is used to get the list of subscriptions to Twitch.tv that have been set up. 

### deleteSubscriptions
During initial setup all subscriptions to Twitch.tv are deleted, before the appropriate subscriptions are set up.  This is to ensure that no residue subscriptions are using up the available allocated by Twitch.tv.

## Twitch_Streamer Class
This is a class which is used to manage the twitch side interactions for users, including setting up subscriptions, grabbing the user ID information and the twitch access token. An instance of this class is created for each user in the database which has an appropriate access token.

### retreive_twitch_data 
When the server is first started or a user has just logged into Twitch, giving Twitch access, this function is used to pull all of their needed Twitch data from the Twitch.tv API. It's a purely backend function which is needed for later functionality. 

### store_twitch_access_token
This function is used to store the twitch access token when a user is going through the Twitch login process.

### setup_live_subscription
Using the Twitch API requires that one registers with the Twitch API as a 'subscription' to specific events.  This is done by this function, which is run when the server first runs or when a user first provides access to their Twitch.tv account.  For this function to run a user must have given permission and an access token for the user on Twitch, without which the Twitch.tv API subscription count is very limited.

### cancel_live_subscriptions
Upon first running the server all pre-existing subscriptions on twitch are cancelled, and an appropriate set of subscriptions are set up for each of the users in the database with approproate accounts for the service.

### make_reference_number
Creates a reference string for Auth0 access.

### get_unique_reference_number
Uses the 'make_reference_number' function to create and return a reference id for the particular run of the server, should only be done once per run of the server. Once the full system is setup this will be run against an appropriate database to ensure that they are unique.

## Twitter

###

## Canvas
Canvas is used to edit the images of a user, 

### save_image_from_url
Function is used to grab a users profile picture from their Twitter page, it is used in the free tier and when the user first logs into their account.

### draw_circle_from_url 
Function is uses Canvas to add a red 'recording' symbol (a circle with a filled circle inside) to the user's twitter profile picture.  This is the functionality of the Free tier, and allows True Profile to be functional from first login of both Twitter and Twitch. 
