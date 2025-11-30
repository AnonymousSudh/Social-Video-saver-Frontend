import axios from "axios";
import { response } from "express";

const downloadController = async (req, res) => {
  console.log("\n================= 📥 New Download Request =================");

  try {
    const { url } = req.body;

    console.log("🔗 Input URL:", url);

    if (!url) {
      console.log("❌ Missing URL in request");
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    console.log("🌐 Calling RapidAPI...");

    const options = {
      method: "GET",
      url: `https://${process.env.INSTAGRAM_HOST}/download`,
      params: { url },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.INSTAGRAM_HOST,
      },
    };

    // const response = await axios.request(options);

    // console.log("📦 RapidAPI Response OK: status", response.status);
    // console.log("📊 Response raw data keys:", Object.keys(response.data));

    // extract video URL
    // const medias = response.data?.data?.medias;

    // console.log("🎞 Total medias found:", medias?.length || 0);
    // console.log(medias[0])
    // const videoUrl = medias?.[0]?.url;  // usable video URL from the array
    // const thumbnailUrl = response.data?.data?.thumbnail;
    // const title = response.data?.data?.title;
    // const author = response.data?.data?.author;
    // const shortcode = response.data?.data?.shortcode;
    // const duration = response?.data?.data?.duration;

    // console.log("▶ VideoURL:", videoUrl);
    // console.log("🖼 Thumbnail:", thumbnailUrl);
    // console.log("📝 Title:", title);
    // console.log("👤 Author:", author);
    // console.log("🔖 Shortcode:", shortcode);

    // if (!videoUrl) {
    //   console.log("❌ No valid downloadable video found");
    //   return res.status(400).json({
    //     success: false,
    //     message: "No downloadable video found",
    //   });
    // }

    console.log("✅ Successfully processed download request");

    console.log("================== 🎉 Completed ==================\n");

    return res.status(200).json({
      // success: true,
      // platform: "instagram",
      // downloadUrl: videoUrl,
      // fileName: `${shortcode}.mp4`,
      // thumbnail: thumbnailUrl,
      // title,
      // author,





      success: true,
      platform: "instagram",
      downloadUrl: "https://instagram.fvii1-1.fna.fbcdn.net/o1/v/t2/f2/m86/AQPEKL0gYVELQluuBAHqumusu0gVTLtESf-g082zjmFlXTJqihKnV7WIcU3QvIqrgcGWFzguR159a9KwWPJ2YKRe1VxhprliaYdEqlI.mp4?_nc_cat=102&_nc_oc=Admaa3CwrT-aEnS9dTwzT02fha6ssjk1Eg3xlVJ-NM3MQXAyFYFM7IfOF_IhMygM-pQ&_nc_sid=5e9851&_nc_ht=instagram.fvii1-1.fna.fbcdn.net&_nc_ohc=1jJC1D6YteMQ7kNvwGYAZtf&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MTExNTk0MDEzNzE5MzQ1MSwiYXNzZXRfYWdlX2RheXMiOjI0LCJ2aV91c2VjYXNlX2lkIjoxMDA5OSwiZHVyYXRpb25fcyI6MjUsInVybGdlbl9zb3VyY2UiOiJ3d3cifQ%3D%3D&ccb=17-1&_nc_gid=gpz7DOHw8qHI8UTYS3lxMQ&_nc_zt=28&vs=86c449886a2f9bd7&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC9CNzRFMjc3NTA0QTBBRDM4MTI4NjYwNjgzRUIwOTdBMV92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HTXFJR3lJZ2p6WWwwUzl6QU05SzNoSk15ODE5YnN0VEFRQUYVAgLIARIAKAAYABsCiAd1c2Vfb2lsATEScHJvZ3Jlc3NpdmVfcmVjaXBlATEVAAAm1r--96G8-wMVAigCQzMsF0A490vGp--eGBJkYXNoX2Jhc2VsaW5lXzFfdjERAHX-B2XmnQEA&oh=00_AfjbrDOvgUuLoCVjzv6bjP4N63EamJtgyOhE_AX8bpgRhg&oe=692CD753",
      fileName: "DQqo9zYEvUV.mp4",
      thumbnail:
        "https://instagram.fvii1-1.fna.fbcdn.net/v/t51.2885-15/573689253_1312500600187116_4722574749497345166_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fvii1-1.fna.fbcdn.net&_nc_cat=1&_nc_oc=Q6cZ2QGwhMMytuuXLZ7ruUKGkanV7miNig1PSZE-A6zY5parUJv8t-3lWxAxsW-yvuEyZ3w&_nc_ohc=JpVBXIyHNl4Q7kNvwETMIVv&_nc_gid=gpz7DOHw8qHI8UTYS3lxMQ&edm=ANTKIIoBAAAA&ccb=7-5&oh=00_Afg8Xfzi2zQ_JhSbNF3Ia1-x-GivqQNvC22nyoUTFoXWBg&oe=6930B5C7&_nc_sid=d885a2",
      title: "LOVELY SONG ♥️✓😻4K STATUS FULL SCREEN ✨ WHATSAPP ✨#shortyoutube #lovestatus#love",
      author: "Premanand mharaj 🌹♥️",
      duration:25



    });

  } catch (error) {
    console.log("\n================== ❌ ERROR ==================");
    console.error("Message:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
    console.log("==============================================\n");

    return res.status(error.response?.status || 500).json({
      success: false,
      message:
        error.response?.data?.message || "Failed to download video. Try again.",
    });
  }
};

export default downloadController;
