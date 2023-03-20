import React from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";

import Dropzone from "../components/dropzone";
import { Typography } from "@mui/material";
import ImageCard from "@/components/image-card";

const Container = styled("div")({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
});

const CardContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  width: 632,
  gap: 10,
  marginTop: 28,
  boxSizing: "border-box",
});

const ImageClassifier = () => {
  const [files, setFiles] = React.useState([]);
  const [results, setResults] = React.useState([]);
  const [downloadId, setDownloadId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const onDrop = (files) => {
    setResults([]);
    setFiles(files);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (let file of files) {
      formData.append("images", file);
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { data, id } = await response.json();
        setResults(
          data.map((result, i) => ({
            ...result,
            file: files[i],
          }))
        );
        setDownloadId(id);
        setFiles([]);
      } else {
        console.error("Error uploading file");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/zips/${downloadId}`, {
        method: "GET",
      });

      if (response.ok) {
        const link = document.createElement("a");
        link.download = `${downloadId}.zip`;
        link.href = `/uploads/zips/${downloadId}.zip`;
        link.click();
      } else {
        console.error("Error uploading file");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRemove = (index) => {
    setFiles((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  return (
    <Container>
      <AppBar
        sx={{
          height: 56,
          paddingLeft: "16px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4">Clasificador de imagenes</Typography>
      </AppBar>
      <Dropzone
        onDrop={onDrop}
        onRemove={handleRemove}
        files={files}
        downloadId={downloadId}
        isDownloading={isDownloading}
        handleDownload={handleDownload}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
      <CardContainer>
        {results.map((r) => (
          <ImageCard {...r} />
        ))}
      </CardContainer>
    </Container>
  );
};

export default ImageClassifier;
