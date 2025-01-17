import { RouteNameType, usePushHistory } from "../utils/routes";
import { roomStore, globalStore } from "@netless/flat-stores";
import { RequestErrorCode, RoomType } from "@netless/flat-server-api";
import { errorTips, message } from "flat-components";
import { FlatI18n } from "@netless/flat-i18n";

export const joinRoomHandler = async (
    roomUUID: string,
    pushHistory: ReturnType<typeof usePushHistory>,
): Promise<void> => {
    const formatRoomUUID = roomUUID.replace(/\s+/g, "");

    try {
        const roomInfo = roomStore.rooms.get(formatRoomUUID);
        const periodicUUID = roomInfo?.periodicUUID;
        if (formatRoomUUID.length < 32) {
            roomStore.rememberNextRoom(formatRoomUUID);
        }

        const data = await roomStore.joinRoom(periodicUUID || formatRoomUUID);
        globalStore.updateShowGuide(data.showGuide);
        globalStore.updatePeriodicUUID(roomInfo?.periodicUUID);

        switch (data.roomType) {
            case RoomType.BigClass: {
                pushHistory(RouteNameType.BigClassPage, data);
                break;
            }
            case RoomType.SmallClass: {
                pushHistory(RouteNameType.SmallClassPage, data);
                break;
            }
            case RoomType.OneToOne: {
                pushHistory(RouteNameType.OneToOnePage, data);
                break;
            }
            default: {
                new Error("failed to join room: incorrect room type");
            }
        }
    } catch (e) {
        // if room not found and is pmi room, show wait for teacher to enter
        if (e.message.includes(RequestErrorCode.RoomNotFoundAndIsPmi)) {
            void message.info(FlatI18n.t("wait-for-teacher-to-enter"));
            return;
        }
        pushHistory(RouteNameType.HomePage);
        errorTips(e);
    }
};
