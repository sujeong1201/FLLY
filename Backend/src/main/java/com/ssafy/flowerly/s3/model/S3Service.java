package com.ssafy.flowerly.s3.model;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.flowerly.entity.FileInfo;
import com.ssafy.flowerly.entity.type.UploadType;
import com.ssafy.flowerly.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final AmazonS3Client amazonS3Client;
    private S3Repository s3Repository;
    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String upload(MultipartFile[] mFiles, UploadType uploadType) throws IOException {
        List<FileInfo> data = new ArrayList<>();

        for(MultipartFile mFile : mFiles){
            if(mFile.getSize() == 0) continue;
            data.add(multiPartToFileInfo(mFile,uploadType));
        }

        s3Repository.saveAll(data);
        return "꽃 사진 업로드 성공";
    }

    public String uploadOneImage(MultipartFile uploadImg, UploadType uploadType) throws IOException {
        FileInfo temp = multiPartToFileInfo(uploadImg, uploadType);
        s3Repository.save(temp);

        return temp.getUploadFileUrl();
    }
    private FileInfo multiPartToFileInfo(MultipartFile uploadImg, UploadType uploadType) throws IOException{
        String uploadFileName = getUUIDFileName(Objects.requireNonNull(uploadImg.getOriginalFilename()));
        String uploadPath = uploadType.name() + "/" + uploadFileName;

        //S3에 업로드할 객체 생성
        ObjectMetadata objMeta = new ObjectMetadata();
        objMeta.setContentLength(uploadImg.getSize());
        objMeta.setContentType(uploadImg.getContentType());
        amazonS3Client.putObject(new PutObjectRequest(bucket, uploadPath, uploadImg.getInputStream(), objMeta));

        String uploadFileUrl = amazonS3Client.getUrl(bucket, uploadPath).toString();
        return FileInfo.builder()
                .originalFileName(uploadImg.getOriginalFilename())
                .uploadFileName(uploadFileName)
                .uploadFilePath(uploadType.name())
                .uploadFileUrl(uploadFileUrl)
                .build();
    }


    private String getUUIDFileName(String fileName) {
        String ext = fileName.substring(fileName.indexOf(".") + 1);
        return UUID.randomUUID() + fileName + "." + ext;
    }
}
