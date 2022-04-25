import {PowerNukkitX as pnx, EventPriority} from ':powernukkitx';
import { Player as PnxPlayer } from 'cn.nukkit.Player';
import { EntityDamageEvent } from 'cn.nukkit.event.entity.EntityDamageEvent';
import { PlayerInteractEvent } from 'cn.nukkit.event.player.PlayerInteractEvent';
import { ItemID } from 'cn.nukkit.item.ItemID';
import { BlockID } from 'cn.nukkit.block.BlockID';
import { BlockFurnaceBurning } from 'cn.nukkit.block.BlockFurnaceBurning';
import { BlockChest } from 'cn.nukkit.block.BlockChest';
import { ContainerInventory } from 'cn.nukkit.inventory.ContainerInventory';

const EventNameMap = {  "onEffectUpdated": 20,
                        "onEffectRemoved": 21,
                         "onInventoryChange": 27, "onMove": 28, "onChangeSprinting": 29, "onSetArmor": 30, "onUseRespawnAnchor": 31,
                        "onOpenContainerScreen": 32,
                        /* Entity Events */
                        "onMobDie": 33, "onMobHurt": 34, "onEntityExplode": 35, "onProjectileHitEntity": 36, "onWitherBossDestroy": 37, "onRide": 38,
                        "onStepOnPressurePlate": 39, "onSpawnProjectile": 40, "onProjectileCreated": 41, "onNpcCmd": 42, "onChangeArmorStand": 43,
                        "onEntityTransformation": 44,
                        /* Block Events */
                        "onBlockInteracted": 10, "onBlockChanged": 10, "onBlockExplode": 10, "onRespawnAnchorExplode": 10, "onBlockExploded": 10,
                        "onFireSpread": 10, "onCmdBlockExecute": 10, "onContainerChange": 10, "onProjectileHitBlock": 10, "onRedStoneUpdate": 10,
                        "onHopperSearchItem": 10, "onHopperPushOut": 10, "onPistonTryPush": 10, "onPistonPush": 10, "onFarmLandDecay": 10,
                        "onUseFrameBlock": 10, "onLiquidFlow": 10,
                        /* Other Events */
                        "onScoreChanged": 10, "onTick": 10, "onServerStarted": 10, "onConsoleCmd": 10, "onConsoleOutput": 10,
                        /* Economic Events */
                        "onMoneyAdd": 10, "onMoneyReduce": 10, "onMoneyTrans": 10, 'onMoneySet': 10,
                        "beforeMoneyAdd": 10, "beforeMoneyReduce": 10, "beforeMoneyTrans": 10, "beforeMoneySet": 10,
                        /* Outdated Events */
                        "onAttack": 10, "onExplode": 10, "onBedExplode": 10,
                        /* Internal */
                        "onFormSelected": 10, "EVENT_COUNT":0};

function isContainer(block){
    let result = false;
    let id = block.getId();
    if(block instanceof BlockFurnaceBurning) result=true;
    else if (block instanceof BlockChest) result=true;
    else if (id == BlockID.BARREL) result=true;
    else if (id == BlockID.ENDER_CHEST) result=true;
    else if (id == BlockID.ANVIL) result=true;
    else if (id == BlockID.BREWING_STAND_BLOCK) result=true;
    return result;
}

/**
 * @see 未验证
 */
const onPreJoin = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerPreLoginEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let isCancel = callback(player);
            if(isCancel==undefined) return;
            else event.setCancelled(!isCancel);
        });
    }
}

/**
 * @see 未验证
 */
const onJoin = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerJoinEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            callback(player);
        });
    }
}

/**
 * @see 未验证
 */
const onLeft = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerQuitEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            callback(player);
        });
    }
}

/**
 * @see 未验证
 */
const onRespawn = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerRespawnEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            callback(player);
        });
    }
}

const onPlayerDie = {
    run: (callback)=>{
        var isEntity = false;
        let e1 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageEvent", EventPriority.NORMAL,event=>{
            if(event.getCause() == EntityDamageEvent.DamageCause.ENTITY_ATTACK){
                isEntity = true;
            }else{
                isEntity = false;
                let player = event.getEntity();
                if(player instanceof PnxPlayer){
                    console.log(player.getHealth()-event.getDamage());
                    if(player.getHealth()-event.getDamage()<=0.2){
                        callback(player,null);
                    }
                }
            }
        });
        let e2 = pnx.listenEvent("cn.nukkit.event.entity.EntityDamageByEntityEvent", EventPriority.NORMAL,event=>{
            if(isEntity==true){
                let player = event.getEntity();
                if(player instanceof PnxPlayer){
                    let damager = event.getDamager();
                    if(player.getHealth()-event.getDamage()<=0.2){
                        callback(player,damager);
                    }
                }
            }
        });
        return e1 && e2;
    }
}

const onPlayerCmd = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerCommandPreprocessEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let cmd = event.getMessage();
            let isCancel = callback(player,cmd);
            if(isCancel==undefined) return;
            else event.setCancelled(!isCancel);
        });
    }
}

/**
 * @see 未验证
 */
const onChat = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerChatEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let cmd = event.getMessage();
            let isCancel = callback(player,cmd);
            if(isCancel==undefined) return;
            else event.setCancelled(!isCancel);
        });
    }
}

/**
 * @see 未验证
 */
const onChangeDim = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.entity.EntityLevelChangeEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            if(player instanceof PnxPlayer){
                let dimension = event.getTarget.getDimension();
                callback(player,dimension);
            }
        });
    }
}

const onJump = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerJumpEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let isCancel = callback(player);
            event.setCancelled(isCancel);
        });
    }
}

/**
 * @see 未验证
 */
const onSneak = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerToggleSneakEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let isSneak = event.isSneaking();
            callback(player,isSneak);
        });
    }
}

/**
 * @see 未验证
 */
const onAttackEntity = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEntityEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let entity = event.getEntity();
            let isCancel = callback(player,entity);
            if(isCancel==undefined) return;
            else event.setCancelled(!isCancel);
        });
    }
}

/**
 * @see 未验证
 */
const onAttackBlock = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            if(event.getAction() == PlayerInteractEvent.Action.LEFT_CLICK_BLOCK){
                let item = event.getItem();
                let block = event.getBlock();
                let isCancel = callback(player,block,item);
                if(isCancel==undefined) return;
                else event.setCancelled(!isCancel);
            }
        });
    }
}

/**
 * @see 未验证
 */
const onUseItem = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            if(event.getAction() == PlayerInteractEvent.Action.RIGHT_CLICK_AIR || event.getAction() == PlayerInteractEvent.Action.RIGHT_CLICK_BLOCK){
                let item = event.getItem();
                let isCancel = callback(player,item);
                if(isCancel==undefined) return;
                else event.setCancelled(!isCancel);
            }
        });
    }
}

const onUseItemOn = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            if(event.getAction() == PlayerInteractEvent.Action.RIGHT_CLICK_BLOCK){
                let item = event.getItem();
                let block = event.getBlock();
                let face = event.getFace().getIndex();
                let isCancel = callback(player,item,block,face);
                if(isCancel==undefined) return;
                else event.setCancelled(!isCancel);
            }
        });
    }
}

const onTakeItem = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.inventory.InventoryPickupItemEvent", EventPriority.NORMAL,event=>{
            let player = event.getViewers()[0];
            let itemEntity = event.getItem();
            let item = event.getItem().getItem();
            let isCancel = callback(player,itemEntity,item);
            if(isCancel==undefined) return;
            else event.setCancelled(!isCancel);
        });
    }
}

const onEat = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerItemConsumeEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let item = event.getItem();
            let isCancel = callback(player,item);
            if(isCancel==undefined) return;
            else event.setCancelled(!isCancel);
        });
    }
}

const onDropItem = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerDropItemEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let item = event.getItem();
            let isCancel = callback(player,item);
            if(isCancel==undefined) return;
            else event.setCancelled(!isCancel);
        });
    }
}

const onConsumeTotem = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.entity.EntityDamageEvent", EventPriority.NORMAL,event=>{
            let player = event.getEntity();
            if(player instanceof PnxPlayer){
                if(player.getInventory().getItemInHand().getId() == ItemID.TOTEM){
                    if(player.getHealth()-event.getDamage()<=0.2){
                        let isCancel = callback(player);
                        if(isCancel==undefined) return;
                        else event.setCancelled(!isCancel);
                    }
                }
            }
        });
    }
}

const onEffectAdded = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.potion.PotionApplyEvent", EventPriority.NORMAL,event=>{
            let player = event.getEntity();
            if(player instanceof PnxPlayer){
                effect = event.getApplyEffect().getName();
                let isCancel = callback(player,effect);
                if(isCancel==undefined) return;
                else event.setCancelled(!isCancel);
            }
        });
    }
}

const onStartDestroyBlock = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.player.PlayerInteractEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            if(event.getAction() == PlayerInteractEvent.Action.LEFT_CLICK_BLOCK ||event.getAction() == PlayerInteractEvent.Action.LEFT_CLICK_AIR){
                let block = event.getBlock();
                callback(player,block);
            }
        });
    }
}

const onDestroyBlock = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.block.BlockBreakEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let block = event.getBlock();
            let isCancel = callback(player,block);
            if(isCancel==undefined) return;
            else event.setCancelled(!isCancel);
        });
    }
}

const onPlaceBlock = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.block.BlockPlaceEvent", EventPriority.NORMAL,event=>{
            let player = event.getPlayer();
            let block = event.getBlock();
            let isCancel = callback(player,block);
            if(isCancel==undefined) return;
            else event.setCancelled(!isCancel);
        });
    }
}

const onOpenContainer = {
    run: (callback)=>{
        return pnx.listenEvent("cn.nukkit.event.inventory.InventoryOpenEvent", EventPriority.NORMAL,event=>{
            if(event.getInventory() instanceof ContainerInventory){
                let player = event.getPlayer();
                let block = player.getTargetBlock(player.getViewDistance());
                let isCancel = callback(player,block);
                if(isCancel==undefined) return;
                else event.setCancelled(!isCancel);
            }
        });
    }
}

const onCloseContainer = {
    run: (callback)=>{
        var map = new Map();
        let e1 = pnx.listenEvent("cn.nukkit.event.inventory.InventoryOpenEvent", EventPriority.NORMAL,event=>{
            if(event.getInventory() instanceof ContainerInventory){
                let player = event.getPlayer();
                map.set(player,player.getTargetBlock(player.getViewDistance()));
            }
        });
        let e2 = pnx.listenEvent("cn.nukkit.event.inventory.InventoryCloseEvent", EventPriority.NORMAL,event=>{
            if(event.getInventory() instanceof ContainerInventory){
                let player = event.getPlayer();
                let isCancel = callback(player,map.get(player));
                console.log(map.size);
                if(isCancel==undefined) return;
                else event.setCancelled(!isCancel);
            }
        });
        return e1 && e2;
    }
}

export const Event = {
    //玩家事件
    onPreJoin: onPreJoin,//count=0
    onJoin: onJoin,
    onLeft: onLeft,
    onRespawn: onRespawn,
    onPlayerDie: onPlayerDie,
    onPlayerCmd: onPlayerCmd,
    onChat: onChat,
    onChangeDim: onChangeDim,
    onJump: onJump,
    onSneak: onSneak,
    onAttackEntity: onAttackEntity,
    onAttackBlock: onAttackBlock,
    onUseItem: onUseItem,
    onUseItemOn: onUseItemOn,
    onTakeItem: onTakeItem,
    onEat: onEat,
    onDropItem: onDropItem,
    onConsumeTotem: onConsumeTotem,
    onEffectAdded: onEffectAdded,
    onStartDestroyBlock: onStartDestroyBlock,
    onDestroyBlock: onDestroyBlock,
    onPlaceBlock: onPlaceBlock,
    onOpenContainer: onOpenContainer,
    onCloseContainer: onCloseContainer
}