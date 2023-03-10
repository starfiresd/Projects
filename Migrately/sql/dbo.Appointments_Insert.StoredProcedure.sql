USE [Migrately]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Insert]    Script Date: 03/07/23 13:57:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Christopher Doupis>
-- Create date: <01-11-2023T14:40:00>
-- Description: Appointments Insert
-- Code Reviewer: 

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC [dbo].[Appointments_Insert]				
       @AppointmentTypeId int
	   ,@ClientId int
	   ,@AttorneyProfileId int
	   ,@Notes nvarchar(2000)
	   ,@IsConfirmed bit
	   ,@AppointmentStart datetime2(7)
	   ,@AppointmentEnd datetime2(7)
	   ,@StatusTypesId int
	   ,@CreatedBy int
	   ,@ModifiedBy int
	   ,@Id int OUTPUT

/*---TEST CODE---

DECLARE @AppointmentTypeId int = 1
	   ,@ClientId int = 5
	   ,@AttorneyProfileId int = 3
	   ,@Notes nvarchar(2000) = 'Notes for testing purposes only'
	   ,@IsConfirmed bit = 0
	   ,@AppointmentStart datetime2(7) = '2023-01-01 00:00:00.0000000'
	   ,@AppointmentEnd datetime2(7) = '2023-01-01 00:00:00.0000000'
	   ,@StatusTypesId int = 1
	   ,@CreatedBy int = 1
	   ,@ModifiedBy int = 1
	   ,@Id int = 0

EXECUTE [dbo].[Appointments_Insert]
		@AppointmentTypeId
		,@ClientId
		,@AttorneyProfileId
		,@Notes
		,@IsConfirmed
		,@AppointmentStart
		,@AppointmentEnd
		,@StatusTypesId
		,@CreatedBy
		,@ModifiedBy
		,@Id OUTPUT

SELECT *
FROM [dbo].[Appointments]
*/

AS

BEGIN

	INSERT INTO [dbo].[Appointments]
		([AppointmentTypeId]
		,[ClientId]
		,[AttorneyProfileId]
		,[Notes]
		,[IsConfirmed]
		,[AppointmentStart]
		,[AppointmentEnd]
		,[StatusTypesId]
		,[DateCreated]
		,[DateModified]
		,[CreatedBy]
		,[ModifiedBy])

	VALUES
		(@AppointmentTypeId
		,@ClientId
		,@AttorneyProfileId
		,@Notes
		,@IsConfirmed
		,@AppointmentStart
		,@AppointmentEnd
		,@StatusTypesId
		,GETUTCDATE()
		,GETUTCDATE()
		,@CreatedBy
		,@ModifiedBy)	   

	SET @Id = SCOPE_IDENTITY()

END
GO
