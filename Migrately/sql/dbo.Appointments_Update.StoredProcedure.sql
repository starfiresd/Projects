USE [Migrately]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Update]    Script Date: 03/07/23 13:57:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Christopher Doupis>
-- Create date: <01-11-2023T15:30:00>
-- Description: Appointments Update
-- Code Reviewer: 

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC [dbo].[Appointments_Update]				
       @AppointmentTypeId int
	   ,@ClientId int
	   ,@AttorneyProfileId int
	   ,@Notes nvarchar(2000)
	   ,@IsConfirmed bit
	   ,@AppointmentStart datetime2(7)
	   ,@AppointmentEnd datetime2(7)
	   ,@StatusTypesId int
	   ,@ModifiedBy int
	   ,@Id int

/*---TEST CODE---

DECLARE @AppointmentTypeId int = 1
	    ,@ClientId int = 3
	    ,@AttorneyProfileId int = 1
	    ,@Notes nvarchar(2000) = 'Updated notes for testing purposes only'
	    ,@IsConfirmed bit = 0
	    ,@AppointmentStart datetime2(7) = '2023-01-02 00:00:00.0000000'
	    ,@AppointmentEnd datetime2(7) = '2023-01-02 00:00:00.0000000'
	    ,@StatusTypesId int = 1
	    ,@ModifiedBy int = 3
	    ,@Id int = 1

SELECT *
FROM [dbo].[Appointments]
WHERE [Id] = @Id

EXECUTE [dbo].[Appointments_Update]
		@AppointmentTypeId
		,@ClientId
		,@AttorneyProfileId
		,@Notes
		,@IsConfirmed
		,@AppointmentStart
		,@AppointmentEnd
		,@StatusTypesId
		,@ModifiedBy
		,@Id

SELECT *
FROM [dbo].[Appointments]
WHERE [Id] = @Id

SELECT *
FROM [dbo].[Appointments]
*/

AS

BEGIN

	UPDATE [dbo].[Appointments]
		SET	 [AppointmentTypeId] = @AppointmentTypeId
			,[ClientId] = @ClientId
			,[AttorneyProfileId] = @AttorneyProfileId
			,[Notes] = @Notes
			,[IsConfirmed] = @IsConfirmed
			,[AppointmentStart] = @AppointmentStart
			,[AppointmentEnd] = @AppointmentEnd
			,[StatusTypesId] = @StatusTypesId
			,[DateModified] = GETUTCDATE()
			,[ModifiedBy] = @ModifiedBy
	WHERE [Id] = @Id

END
GO
