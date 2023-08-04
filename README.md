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

## Twitch

### 

## Twitter

###

## Canvas
Canvas is used to edit the images of a user, 

### save_image_from_url
Function is used to grab a users profile picture from their Twitter page, it is used in the free tier and when the user first logs into their account.

### draw_circle_from_url 
Function is uses Canvas to add a red 'recording' symbol (a circle with a filled circle inside) to the user's twitter profile picture.  This is the functionality of the Free tier, and allows True Profile to be functional from first login of both Twitter and Twitch. 
