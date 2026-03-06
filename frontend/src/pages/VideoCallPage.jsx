import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuth } from '../context/AuthContext';

const APP_ID = 1506640598;
const SERVER_SECRET = '0602a295b2b7dd48363c15517ff3ef4a';

const VideoCallPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const containerRef = useRef(null);

    const roomID = searchParams.get('roomID');
    const doctorName = searchParams.get('doctor') || 'Doctor';

    useEffect(() => {
        if (!roomID || !containerRef.current) return;

        const userName = user?.name || user?.email?.split('@')[0] || 'Patient';

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            APP_ID,
            SERVER_SECRET,
            roomID,
            Date.now().toString(), // unique userID
            userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: containerRef.current,
            turnOnMicrophoneWhenJoining: true,
            turnOnCameraWhenJoining: true,
            showMyCameraToggleButton: true,
            showMyMicrophoneToggleButton: true,
            showAudioVideoSettingsButton: true,
            showScreenSharingButton: true,
            showTextChat: true,
            showUserList: true,
            maxUsers: 2,
            layout: 'Auto',
            showLayoutButton: false,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
            onLeaveRoom: () => {
                navigate('/');
            },
        });
    }, [roomID, user]);

    if (!roomID) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="glass-card rounded-3xl p-10 text-center max-w-md">
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">Invalid Meeting Link</h2>
                    <p className="text-slate-600">No Room ID found. Please use the meeting link from your confirmation email.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-900">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-white font-bold text-lg">CareConnect — Video Consultation</h2>
                    <p className="text-blue-200 text-sm">With {doctorName} · Room: {roomID}</p>
                </div>
                <span className="flex items-center gap-2 text-green-300 text-sm font-semibold">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                    LIVE
                </span>
            </div>

            {/* ZegoCloud Container */}
            <div ref={containerRef} className="flex-1 w-full" style={{ minHeight: 'calc(100vh - 72px)' }} />
        </div>
    );
};

export default VideoCallPage;
