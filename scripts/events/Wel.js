// Goat Bot Messenger - Beautiful Welcome Handler with Card
// New member + who added + group DP

const welcomeHandler = async (event, api) => {
    if (event.type === 'event' && event.logMessageType === 'log:subscribe') {
        const threadID = event.threadID;
        const addedParticipants = event.logMessageData.addedParticipants || [];
        const adderID = event.author; // Who added the member
        
        // Get group info for DP
        api.getThreadInfo(threadID, (err, threadInfo) => {
            if (err) {
                console.error("Thread info error:", err);
                return;
            }
            
            const groupName = threadInfo.name || "Our Group";
            const groupDP = threadInfo.imageSrc || "https://i.imgur.com/default-group.jpg";
            
            for (const participant of addedParticipants) {
                const userID = participant.userFbId;
                const userName = participant.name || "বন্ধু";
                
                // Get adder name
                api.getUserInfo(adderID, (err, userInfo) => {
                    const adderName = err ? "Someone" : (userInfo[adderID].name || "Admin");
                    
                    // Beautiful card-style welcome
                    const welcomeMessage = {
                        body: `🎴 **Welcome Card** 🎴\n\n` +
                              `🐐 **${userName}** জয়েন করেছে!\n` +
                              `➕ Added by: **${adderName}**\n\n` +
                              `🌟 **Group:** ${groupName}\n` +
                              `হ্যাঁ রে ভাই! Goat Bot এখানে আছে 🔥\n` +
                              `আমি তোমার সাথে আছি সবসময়। কোনো হেল্প লাগলে বলো!\n\n` +
                              `Type \`/help\` for commands 🐐`,
                        attachment: {
                            type: "image",
                            payload: {
                                url: groupDP  // Group DP as card
                            }
                        }
                    };
                    
                    // Send welcome message
                    api.sendMessage(welcomeMessage, threadID, (err) => {
                        if (err) console.error("Welcome message send error:", err);
                    });
                    
                    console.log(`🐐 Welcomed ${userName} added by ${adderName}`);
                });
            }
        });
    }
};

module.exports = welcomeHandler;

// Use in main file:
// const welcome = require('./welcome.js');
// api.listenMqtt((err, event) => welcome(event, api));
