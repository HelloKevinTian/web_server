/**
 * Created by King Lee on 14-4-17.
 * some more about generic pool,read https://github.com/yuyunliuhen/node-pool.
 */
var fs = require('fs');
var redis = require('redis');
var generic_pool = require('generic-pool');

//  store the map of redis connect pool,{db_name:pool}
var pools = {};

function createRedisPool(db_name,config_file){
    var opts = {
        "no_ready_check" : config_file.proxy
    };
    // create a redis connection pool with
    // a max of config_file.max connections, and a config_file.idleTimeoutMillis second max idle time
    return generic_pool.Pool({
        name : db_name,
        dbIndex : 0,
        create : function(cb) {
            /**
             * create a new client connection. port defaults to 6379 and host defaults to 127.0.0.1.
             * If you have redis-server running on the same computer as node, then the defaults for port and host are probably fine.
             *
             * opts:no_ready_check: defaults to false. When a connection is established to the Redis server,
             * the server might still be loading the database from disk. While loading, the server not respond to any commands.
             * To work around this, node_redis has a "ready check" which sends the INFO command to the server.
             * The response from the INFO command indicates whether the server is ready for more commands.
             * When ready, node_redis emits a ready event. Setting no_ready_check to true will inhibit this check.
             */
            var client = redis.createClient(config_file.port, config_file.hostname, opts);
            client.on('error', function(err) {
                console.error('error at connect redis: %s', err.stack);
            });
            cb(null, client);
        },
        destroy : function(client) {
            if (!config_file.proxy) {
                client.quit();
            }
        },
        max : config_file.max,
        // optional. if you set this, make sure to drain() (see step 3)
        //  min      : 2,
        // specifies how long a resource can stay idle in pool before being removed
        idleTimeoutMillis : config_file.idleTimeoutMillis,
        // if true, logs via console.log - can also be a function
        log : true
    });
}

//  read config file and initialize generic pool
function initRedisPool(config_file) {
    for (var item in config_file) {
        var _pool = createRedisPool(item, config_file[item]);
        pools[item] = _pool;
    }
}

//  special the address of config file
function configure(config_file) {
    config_file = config_file || process.env.REDIS_CONFIG;

    if (typeof config_file === 'string') {
        config_file = JSON.parse(fs.readFileSync(config_file, 'utf8'));
    }

    if (config_file) {
        initRedisPool(config_file);
    }
}

//  do redis command
function execute(db_name, execb) {
    var pool = pools[db_name];
    pool.acquire(function(err, client) {
        var release = function() { pool.release(client); };
        if (err) {
            console.error('error at execute command: %s', err.stack);
            release();
        } else {
            execb(client, release);
        }
    }, 0);
}

//  print current status info
function info() {
    return Object.keys(pools).map(function(k) {
        var item = pools[k];
        return {
            name : item.getName(),
            total : item.getPoolSize(),
            available : item.availableObjectsCount(),
            waiting : item.waitingClientsCount()
        };
    });
}

function show(){
    setInterval(function() {
        console.log('redis pool is %j', info());
    }, 5000);
}

//show();

module.exports = {
    configure : configure,
    execute : execute,
    info : info
};

