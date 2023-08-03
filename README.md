*This was a project to take the state of a streamer from Twitch.tv and use it to update the Twitter profile of that streamer.*

To update a twitter profile picture requried the twitter api path 'https://api.twitter.com/1.1/account/update_profile_image.json'.  Which has been deprecated as of May 2023.

As such this is now just an example project I will refer back to sometimes when needed, all secrets have been removed.

# True Profile
Service to update Social Media profiles to reflect live information.

Connects to the repository 'trueprofile_frontend'.

Uses Nodejs on the backend, and Angular on the frontend.

# Pricing Structure

| Tier | Cost | Functionality |
| Free | Free | When a user goes live on Twitch their Twitter profile is grabbed from Twitter, a red 'live' circle is added to the image and it is reuploaded to Twitter, and 'Live Now' is added to their current profile description |
| User | ~$3 | A user can choose a custom live and offile image, and description, when they go live/offline the profile image and description is swapped automatically |
| Power User | ~$10 | A user at this tier can create a different set of profile image and profile description for any game that twitch recognizes |

# API Reference

## Profile

## Streamer

## Twitch

## Twitter


# Service Reference

## Canvas
Canvas is used to edit the images of a user, 

### save_image_from_url
Function is used to grab a users profile picture from their Twitter page, it is used in the free tier and when the user first logs into their account.
