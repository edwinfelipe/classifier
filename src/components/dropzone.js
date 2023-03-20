import React from "react";
import { styled } from "@mui/material/styles";
import Dropzone from "react-dropzone";

import Box from "@mui/material/Box";
import {
  Card,
  CardContent,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Close from "@mui/icons-material/Close";
const DropContainer = styled(Box)(({ theme }) => ({
  width: 600,
  minHeight: 200,
  border: `dashed 2px ${theme.palette.primary.main}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& > div": {
    cursor: "pointer",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const ImagesContainer = styled(Box)({
  width: "100%",
  padding: "12px",
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(6, 1fr)",
  "& > div": {
    position: "relative",
    "& .close-icon": {
      position: "absolute",
      top: -18,
      right: -13,
    },
  },
});
const Uploader = ({
  onDrop,
  handleSubmit,
  handleDownload,
  onRemove,
  files,
  isLoading,
  downloadId,
  isDownloading,
}) => {
  const hasFiles = React.useMemo(() => !!files.length);
  return (
    <Card sx={{ marginTop: 12 }}>
      <CardContent
        sx={{ alignItems: "center", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: "1px",
          }}
        >
          <Typography variant="h5">Sube tus imagenes</Typography>
          <Typography variant="h6">jpg, png, jpeg</Typography>
        </Box>
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <DropContainer>
              <div {...getRootProps()}>
                <input {...getInputProps()} id="Files" />
                <ImagesContainer>
                  {files.map((file, index) => (
                    <div>
                      <img
                        width="60"
                        height="60"
                        src={URL.createObjectURL(file)}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(index);
                        }}
                        className="close-icon"
                      >
                        <Close fontSize="12" />
                      </IconButton>
                    </div>
                  ))}
                </ImagesContainer>
                <CloudUpload color="primary" sx={{ fontSize: 64 }} />
                <Typography variant="body1">
                  Arrastra y suelta algunas imagenes, o haz click para
                  seleccionarlas
                </Typography>
              </div>
            </DropContainer>
          )}
        </Dropzone>
        <Box mt={4}>
          <Button
            onClick={handleSubmit}
            disabled={!hasFiles || isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress thickness={2} size={20} />
              ) : undefined
            }
            variant="contained"
          >
            Analizar Imagenes
          </Button>
          {downloadId && (
           <Box mt={2} display='flex' justifyContent='center'>
             <Button
              onClick={handleDownload}
              color="warning"
              disabled={!downloadId || isDownloading}
              startIcon={
                isDownloading ? (
                  <CircularProgress thickness={2} size={20} />
                ) : undefined
              }
              variant="contained"
            >
              Descargar Zip
            </Button>
           </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Uploader;
