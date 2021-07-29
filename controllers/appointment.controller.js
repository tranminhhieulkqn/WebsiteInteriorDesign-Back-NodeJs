const AppointmentModel = require('../models/appointment.model')
module.exports = {
    create: async (req, res) => {
        try {
            appointmentData = req.body;
            if (!appointmentData)
                return res.status(404).json({
                    success: false,
                    message: 'no info appointment.'
                });
            var appointmentCreated = await AppointmentModel.create(appointmentData);
            return res.status(200).json({
                success: true,
                message: 'appointment created successfully.',
                appointment: appointmentCreated
            })
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllappointment: async (req, res) => {
        try {
            // define appointment array
            var appointmentArray = [];
            // get appointment data from firestore
            var appointmentData = await AppointmentModel._collectionRef.get();
            appointmentData.forEach(doc => {
                appointment = doc.data();
                appointment.id = doc.id;
                appointmentArray.push(appointment); // push to appointmentarray
            })
            // return result
            return res.status(200).json({
                success: true,
                message: "list of appointment.",
                appointments: appointmentArray
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllByUser: async (req, res) => {
        try {
            let { pageSize, currentPage, userID, role } = req.query;

            role = (role === 'user') ? 'customer' : 'designer';
            pageSize = Number(pageSize) || 1
            currentPage = Number(currentPage) || 1

            // Get size all userID and on page
            dataSize = await AppointmentModel._collectionRef
                .where(`${role}ID`, '==', userID)
                .get();
            let totalItem = dataSize.size || 0;
            let totalPage = Math.ceil(dataSize.size / pageSize) || 0

            // define users array
            var appointmentArray = [];
            first = await AppointmentModel._collectionRef
                .where(`${role}ID`, '==', userID)
                .orderBy('dateCreated', 'desc')
                .limit(pageSize * (currentPage - 1) + 1)
                .get();

            try {
                resultsData = await AppointmentModel._collectionRef
                    .where(`${role}ID`, '==', userID)
                    .orderBy('dateCreated', 'desc')
                    .startAt(first.docs[first.docs.length - 1].data()['dateCreated'])
                    .limit(Number(pageSize))
                    .get();

                resultsData.forEach(doc => {
                    app = doc.data();
                    app.id = doc.id;
                    appointmentArray.push(app); // push to appointmentArray
                })
            } catch (error) {

            }

            // return result
            return res.status(200).json({
                success: true,
                message: "list of appointments.",
                appointments: appointmentArray,
                totalItem: totalItem,
                totalPage: totalPage
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },

    getByID: async (req, res) => {
        try {
            let { id } = req.query;
            // get appointment data from firestore
            var appointmentData = await AppointmentModel.getById(`${id}`);
            // if not exist
            if (!appointmentData)
                return res.status(404).json({
                    success: false,
                    message: `appointment not exist.`,
                });
            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `data of appointment`,
                appointment: appointmentData
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
}