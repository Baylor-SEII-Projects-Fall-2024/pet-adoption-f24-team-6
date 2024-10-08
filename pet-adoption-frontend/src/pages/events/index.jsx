import Head from "next/head";
import React from "react";

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        width: "80%",
        margin: "0 auto"
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px"
    },
    box: {
        backgroundColor: "#f0f0f0",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "300px", // height of box, adjust if needed
        width: "30%" // Take up 1/3 of the row, so that here is 3 per row
    },
    imageContainer: {
        height: "66.66%", // image takes 2/3 of box
        backgroundColor: "#ccc"
    },
    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },
    textContainer: {
        height: "33.33%", // text takes 1/3 of the box
        padding: "10px",
        textAlign: "center",
        backgroundColor: "#fff"
    }
};

const Row = ({ children }) => {
    return <div style={styles.row}>{children}</div>;
};

const Box = ({ imageUrl, text, link }) => {
    return (
        <a href={link} style={styles.box}>
            <div style={styles.imageContainer}>
                <img src={imageUrl} alt="box content" style={styles.img} />
            </div>
            <div style={styles.textContainer}>
                <p>{text}</p>
            </div>
        </a>
    );
};

export default function events() {
    return (
        <div style={styles.container}>
            <Row>
                <Box
                    imageUrl="https://www.waco-texas.com/files/sharedassets/public/v/1/departments/animal-care-and-shelter/images/front.png"
                    text="Box 1"
                    link="http://localhost:3000"
                />
                <Box
                    imageUrl="https://via.placeholder.com/150"
                    text="Box 2"
                    link="http://localhost:3000"
                />
                <Box
                    imageUrl="https://via.placeholder.com/150"
                    text="Box 3"
                    link="http://localhost:3000"
                />
            </Row>

            <Row>
                <Box
                    imageUrl="https://via.placeholder.com/150"
                    text="Box 4"
                    link="http://localhost:3000"
                />
                <Box
                    imageUrl="https://via.placeholder.com/150"
                    text="Box 5"
                    link="http://localhost:3000"
                />
                <Box
                    imageUrl="https://via.placeholder.com/150"
                    text="Box 6"
                    link="http://localhost:3000"
                />
            </Row>
        </div>
    )
}