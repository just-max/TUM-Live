package dao

import (
	"TUM-Live/model"
	"fmt"
	"gorm.io/gorm/clause"
	"time"
)

func AddMessage(chat model.Chat) {
	DB.Save(&chat)
}

//GetMessagesForStream returns all messages for a stream
func GetMessagesForStream(streamID uint) (messages []model.Chat, err error) {
	cacheKey := fmt.Sprintf("MessagesForStream%d", streamID)
	if cached, found := Cache.Get(cacheKey); found {
		return cached.([]model.Chat), nil
	}
	err = DB.
		Preload(clause.Associations).
		Order("created_at DESC").
		Where("stream_id = ? AND reply_to IS NULL", streamID).
		Find(&messages).Error
	if err == nil {
		Cache.SetWithTTL(cacheKey, messages, 1, time.Second) // short cache prevents DB bursts
	}
	return
}

//IsUserCooledDown returns true if a user sent 5 messages within the last two minutes
func IsUserCooledDown(uid string) bool {
	var chat []model.Chat
	res := DB.Table("chats").Where("user_id = ? AND created_at > ADDTIME(NOW(), '-0:02:0')", uid).Scan(&chat)
	return res.RowsAffected >= 5
}
