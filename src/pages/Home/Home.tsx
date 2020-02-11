import * as React from 'react';
import AnnouncementDisplay from "../../components/AnnouncementDisplay/AnnouncementDisplay";

const Home = () => (
    <div className="container main-container">
        <h1 className="title">Home Page</h1>
        <p>Welcome to Home Site!</p>

        <hr />
        <h1 className="title">Announcements</h1>
        <AnnouncementDisplay />
    </div>
);

export default Home;
