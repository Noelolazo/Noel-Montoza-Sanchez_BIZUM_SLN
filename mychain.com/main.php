<?php
require_once 'com/clsBlock.php';
require_once 'com/clsBlockchain.php';
require_once 'com/clsTransaction.php';

require_once 'utils/dbo/daoConnection.php';
require_once 'utils/dbo/daoCommand.php';
// require_once 'utils/dbo/daoManager.php';

$connection = new DBConnection('172.17.0.2,1433', 'BlockchainDB', 'sa', 'Password2!');
$pdoObject = $connection->getPDOObject();
$dbCommand = new DBCommand($pdoObject);

$myBlockchain = new Blockchain();

// $myBlockchain->load();

// var_dump($myBlockchain);
$tx1 = new Transaction('Noel', 'Eiyoub', 50);

$block2 = new Block(($myBlockchain->getLatestBlock())->index + 1, date("Y-m-d H:i:s"), [$tx1]);
$myBlockchain->addBlock($block2);


// echo(json_encode($myBlockchain->chain));

echo(json_encode($myBlockchain));
echo('Is blockchain valid?' . $myBlockchain->isChainValid());

echo ("<br>AÑADIENDO A SQL");

// $dbManager = new DBManager($dbCommand);

$myBlockchain->save();
echo ("AÑADIDO A SQL CORRECTAMENTE");