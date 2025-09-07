const mongoose = require("mongoose");
const User = require("./models/customersSchema");
mongoose.connect("mongodb+srv://dash_node:HrMgqCO4HXd0YUEh@cluster0.vidmubj.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0")
    .then(async () => {
        const docs = await User.find();
        for (let doc of docs) {
            const randomCreated = new Date(
                2020 + Math.floor(Math.random() * 5),
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1,
                Math.floor(Math.random() * 24),
                Math.floor(Math.random() * 60)
            );
            const randomUpdated = new Date(
                randomCreated.getTime() + Math.floor(Math.random() * 100000000)
            );
            await User.collection.updateOne(
                { _id: doc._id },
                { $set: { createdAt: randomCreated, updatedAt: randomUpdated } }
            );
        }
        mongoose.connection.close();
    })
    .catch(err => console.error(err));



// const mongoose = require("mongoose");
// const User = require("./models/customersSchema");
// mongoose.connect("mongodb+srv://dash_node:HrMgqCO4HXd0YUEh@cluster0.vidmubj.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0")
//     .then(async () => {
//         const docs = await User.find();
//         for (let doc of docs) {
//             const randomCreated = new Date(
//                 2020 + Math.floor(Math.random() * 5),
//                 Math.floor(Math.random() * 12),
//                 Math.floor(Math.random() * 28) + 1,
//                 Math.floor(Math.random() * 24),
//                 Math.floor(Math.random() * 60)
//             );
//             const randomUpdated = new Date(
//                 randomCreated.getTime() + Math.floor(Math.random() * 100000000));
//             await User.updateOne(
//                 { _id: doc._id },
//                 { $set: { createdAt: randomCreated, updatedAt: randomUpdated } },
//                 { timestamps: false }
//             );
//         }
//         mongoose.connection.close();
//     })
//     .catch(err => console.error(err));
