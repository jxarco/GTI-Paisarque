<?php
    $first_to_delete = $_REQUEST["file"];  
    $sec_to_delete = $_REQUEST["a_file"];  
    $folder_to_delete = $_REQUEST["folder"];  
    
    unlink($first_to_delete);
    unlink($sec_to_delete);


    $dir = $folder_to_delete;
    $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
    $files = new RecursiveIteratorIterator($it,
             RecursiveIteratorIterator::CHILD_FIRST);

    foreach($files as $file) {
        if ($file->isDir()){
            rmdir($file->getRealPath());
        } else {
            unlink($file->getRealPath());
        }
    }
    rmdir($dir);

?>