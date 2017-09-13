<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Exportar PaisArque</title>
    <link rel="icon" href="http://icons.iconarchive.com/icons/icons8/windows-8/512/City-Archeology-icon.png">    
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/custom.min.css" rel="stylesheet">
    <link href="css/estilo.css" rel="stylesheet">
    <link href="css/header.css" rel="stylesheet">
    <link rel="stylesheet" href="css/RWD.css"> <!-- responsive web design -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Oswald">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <script type="text/javascript">
        // Used to toggle the menu on small screens when clicking on the menu button
        function showNavbar() {
            var x = document.getElementById("navDemo");
            if (x.className.indexOf("w3-show") == -1) {
                x.className += " w3-show";
            } else { 
                x.className = x.className.replace(" w3-show", "");
            }
        }
    </script>

        
s</head>
    <body class="container">
        
       <!-- Navbar -->
        <div class="w3-top">
          <div class="w3-bar w3-card-2">
            <a class="w3-bar-item w3-button w3-padding-large w3-hide-large w3-right" onclick="showNavbar()" title="Toggle Navigation Menu"><i class="fa fa-bars"></i></a>
            <a onclick="loadContent('inicio.php')" id="megatitle" class="w3-bar-item w3-button w3-padding-large">PaisArque</a>
            <a onclick="loadContent('modelo.html')" class="w3-bar-item w3-button w3-padding-large w3-hide-small w3-hide-medium">3D</a>
            <a onclick="loadContent('infoextra.html')" class="w3-bar-item w3-button w3-padding-large w3-hide-small w3-hide-medium">APORTACIONES</a>
            <a onclick="loadContent('exportar.php')" class="w3-bar-item w3-button w3-padding-large w3-hide-small w3-hide-medium active">EXPORTAR</a>
            <a onclick="loadContent('ayuda.html')" class="w3-bar-item w3-button w3-padding-large w3-hide-small w3-hide-medium">AYUDA</a>
            <a onclick="loadContent('contacto.html')" class="w3-bar-item w3-button w3-padding-large w3-hide-small w3-hide-medium">CONTACTO</a>
            <a class="w3-bar-item w3-button w3-right w3-padding-large logout-button"><span class="glyphicon glyphicon-off" aria-hidden="true"></span></a>
            <a class="w3-bar-item w3-button w3-right w3-padding-large w3-hide-small w3-hide-medium textUser">username</a>
          </div>
        </div>

        <!-- Navbar on small screens -->
        <div id="navDemo" class="w3-bar-block w3-hide w3-hide-large w3-top" style="margin-top:46px">
            <a class="w3-bar-item w3-button w3-padding-large textUser">username</a>
            <a onclick="loadContent('modelo.html')" class="w3-bar-item w3-button w3-padding-large">3D</a>
            <a onclick="loadContent('infoextra.html')" class="w3-bar-item w3-button w3-padding-large">APORTACIONES</a>
            <a onclick="loadContent('exportar.php')" class="w3-bar-item w3-button w3-padding-large">EXPORTAR</a>
            <a onclick="loadContent('ayuda.html')" class="w3-bar-item w3-button w3-padding-large">AYUDA</a>
            <a onclick="loadContent('contacto.html')" class="w3-bar-item w3-button w3-padding-large">CONTACTO</a>
        </div>
        
        <content class="row"><div class="col-lg-12" style="margin-top:46px">
            
            <h3 class="w3-xxlarge"><b>EXPORTAR</b></h3>
            <br>            
            
        <!--Aqui tendrian que haber diferentes opciones de export (jpg/pdf):
        <br>
        - Modelo 3D con sin info/medidas/anotaciones
        <br>
        - Snapshots de modelo 3D
        <br>
        - Opciones de modificar la imagen final (cambiar color de fondo, añadir escala)
        <br>
        - Posibilidad de exportar anotaciones en formato word/medidas, etc.-->

        <?php 
            echo '<a href="';
            echo 'data/' . $_GET['r'] . '/mesh.obj"';
            echo 'download="" title="Descargar Mesh" type="button" class="btn btn-default">Descargar Mesh</a>';
            echo '<a href="';
            echo 'data/' . $_GET['r'] . '/tex_0.jpg"';
            echo 'download="" title="Descargar Textura" type="button" class="btn btn-default">Descargar Textura</a>';
            echo '<a href="';
            echo 'data/' . $_GET['r'] . '.json"';
            echo 'download="" title="Descargar archivo de configuración" type="button" class="btn btn-default">Descargar archivo de configuración</a>';
        ?>
            <br>
            <br>
            <br>
            
            <h5>Opciones de exportación</h5>
            <table class="table table-striped table-hover" id="export-table">
                <tbody>
                     <tr>
                        <td>Resumen del del proyecto</td>
                        <td>Doc</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Configuración</td>
                        <td>-</td>
                        <td>-</td>
                        <td><a href="data/guest/super_test.json" download="" title="Descargar archivo de configuración">JSON</a></td>
                    </tr>
                    <tr>
                        <td>Información básica</td>
                        <td>Doc</td>
                        <td>-</td>
                        <td>JSON</td>
                    </tr>
                    <tr>
                        <td>Anotaciones</td>
                        <td>-</td>
                        <td>XLS</td>
                        <td>JSON</td>
                    </tr>
                    <tr>
                        <td>Medidas</td>
                        <td>-</td>
                        <td>XLS</td>
                        <td>JSON</td>
                    </tr>
                    <tr>
                        <td>Areas</td>
                        <td>-</td>
                        <td>XLS</td>
                        <td>JSON</td>
                    </tr>
                    <tr>
                        <td>Aportaciones</td>
                        <td>Doc</td>
                        <td>XLS</td>
                        <td>JSON</td>
                    </tr>
                    <tr>
                        <td>Modelo 3D</td>
                        <?php 
                            echo '<td><a href="';
                            echo 'data/' . $_GET['r'] . '/mesh.obj"';
                            echo 'download="" title="Descargar mesh">Mesh (.obj)</a></td>';
                         php?>
                        <?php 
                            echo '<td><a href="';
                            echo 'data/' . $_GET['r'] . '/tex_0.jpg"';
                            echo 'download="" title="Descargar textura">Textura (.jpg)</a></td>';
                         php?>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            
        </div>
        
        </content>
        
        <footer>
        </footer><!--   footer end-->
            

         <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
        <!-- Include all compiled plugins (below), or include individual files as needed -->
        <script src="js/extra/bootstrap.min.js"></script>
        <script src="js/extra/custom.js"></script>
        <script type="text/javascript" src="js/extra/gl-matrix-min.js"></script>
        <script type="text/javascript" src="js/extra/rangeslider.min.js"></script>
        <script type="text/javascript" src="js/extra/litegl.js"></script>
        <script type="text/javascript" src="js/extra/rendeer.js"></script>
        <script src="litefile/litefileserver.js"></script>
        <script src="litefile/js/codeLite.js"></script>
        <script src="js/utils.js"></script>
       <script type="text/javascript">
            PAS.recover(); // load paisarque session
        </script>
        <script src="js/tools.js"></script>
        <script src="js/events.js"></script>
        <script>
        
            if(0)
                $("content").html("");
        
        </script>
    </body>
    
</html>