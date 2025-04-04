<?php

// require_once 'DBCommand.php';

class DBManager {
    private $dbCommand;

    public function __construct($dbCommand) {
        $this->dbCommand = $dbCommand;
    }

    // public function add_blockSQL($block)
    // {
    //     try {
    //         $this->dbCommand->execute('AddBlock', array($block->previousHash, $block->hash));
    //         $transactions = $block->getTransactions();
    //         for ($i = 0; $i < count($transactions); $i++) {
    //             $transaction = $transactions[$i]->getData();

    //             $this->dbCommand->execute('AddTransaction', array($transaction[0], $transaction[1], $transaction[2], $block->index));
    //         }
    //     } catch (PDOException $e) {
    //         echo 'Error: ' . $e->getMessage();
    //     }
    // }
}

?>
